import requests
import re

# Configuration
base_url = "http://10.2.1.207:8081"
latest_release = "2025-01"

headers = {
    "API-Version": "v2",
    "Accept-Language": "en",
    "Accept": "application/json"
}

def clean_title(text):
    """Remove <em class='found'> highlighting tags"""
    return text.replace("<em class='found'>", "").replace("</em>", "")

def is_icd11_code(query):
    """Simple but reliable check for valid-looking ICD-11 codes"""
    pattern = r'^[A-Z0-9]{1,5}(\.[A-Z0-9]{1,3})?([./&][A-Z0-9]{1,5}(\.[A-Z0-9]{1,3})?)*$'
    query = query.strip().upper()
    return bool(re.match(pattern, query)) and len(query) <= 20

def search_icd11(rq):
    """
    Universal ICD-11 search: accepts either disease description or ICD code.
    Returns: list of dictionaries (even if only one result)
    """
    query = rq.strip()
    options = []

    # ——— CASE 1: Looks like an ICD-11 code → direct lookup ———
    if is_icd11_code(query):
        print(f"Detected ICD-11 code: {query} → Using direct code lookup")
        url = f"{base_url}/icd/release/11/{latest_release}/mms/codeinfo/{query}"
        
        try:
            response = requests.get(url, headers=headers)
            if response.status_code == 404:
                print(f"Code {query} not found (404)")
                return options
            response.raise_for_status()
            data = response.json()

            title = clean_title(data.get("title", {}).get("@value", "Unknown"))
            code = data.get("code", query)
            entity_id = data.get("id", "N/A")

            options.append({
                "Title": title,
                "ICD Code": code,
                "Entity ID": entity_id
            })
            return options  # Return immediately — exact match

        except requests.RequestException as e:
            print(f"Error looking up code {query}: {e}")
            return options

    # ——— CASE 2: Text description → search ———
    else:
        print(f"Searching by description: '{query}'")
        search_url = f"{base_url}/icd/release/11/{latest_release}/mms/search"
        params = {
            "q": query,
            "useFlexisearch": "true",
            "flatResults": "true",
            "highlighting": "true",
            "medicalMode": "false"
        }

        try:
            response = requests.get(search_url, params=params, headers=headers)
            response.raise_for_status()
            data = response.json()
            results = data.get("destinationEntities", [])

            if not results:
                print("No results found.")
                return options

            for entity in results:
                title = clean_title(entity.get("title", "N/A"))
                code = entity.get("theCode", "N/A")
                entity_id = entity.get("id", "N/A")

                options.append({
                    "Title": title,
                    "ICD Code": code,
                    "Entity ID": entity_id
                })

            print(f"Found {len(options)} result(s) for '{query}'")
            return options

        except requests.RequestException as e:
            print(f"Search error: {e}")
            return options


# ——— EXAMPLE USAGE ———
if __name__ == "__main__":
    test_queries = [
        "malaria",
        "diabetes mellitus",
        "1F40.0",
        "1F41.Z",
        "KA64.1",
        "8A60",
        "hypertension",
        "1C61.Z"
    ]

    for q in test_queries:
        print("\n" + "="*60)
        print(f"QUERY → {q}")
        results = search_icd11(q)
        for item in results[:5]:  # Show first 5
            print(f"  • {item['ICD Code']} | {item['Title']}")
        if len(results) > 5:
            print(f"     ... and {len(results)-5} more")