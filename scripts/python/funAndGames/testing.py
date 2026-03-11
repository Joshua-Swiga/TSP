import requests
import json

# Base URL of your local ICD-API deployment
base_url = "http://10.2.1.207:8081"

# Common headers required for all API calls
headers = {
    "API-Version": "v2",
    "Accept-Language": "en",  # Matches your container's loaded language; change to "es" etc. if needed
    "Accept": "application/json"
}

# Skip fetching releases since it 404s locally; hardcoded from your logs
latest_release = "2025-01"  # Confirm via logs; adjust if different (e.g., "2024-01")
print(f"Using ICD-11 release: {latest_release}")

# Function to search for disease entities by name or description
def search_disease(query):
    search_url = f"{base_url}/icd/release/11/{latest_release}/mms/search"
    
    # Parameters for GET request (switched from POST to match local behavior)
    params = {
        "q": query,
        "useFlexisearch": "true",   # Enables flexible search (stemming, synonyms, etc.)
        "flatResults": "true",      # Returns flat list instead of hierarchical
        "highlighting": "true",     # Highlights matching terms in results
        "medicalMode": "false"      # Optional: set "true" for medical coding specifics
        # Add more: "chapterFilter": "01", "propertiesToBeSearched": "title,definition"
    }
    
    options = []  # List to hold the dictionary objects
    
    try:
        response = requests.get(search_url, params=params, headers=headers)
        print(f"Request URL: {response.url}")  # For debugging: shows full URL with params
        response.raise_for_status()
        data = response.json()
        
        # Results are under 'destinationEntities' in MMS search (flatResults=true)
        results = data.get("destinationEntities", []) or data.get("words", [])  
        
        if not results:
            print("No results found.")
            return options  # Return empty list if no results
        
        for entity in results:
            # Clean title by removing <em class='found'> and </em>
            title = entity.get("title", "N/A").replace("<em class='found'>", "").replace ("</em>", "")
            code = entity.get("theCode", "N/A")
            entity_id = entity.get("id", "N/A")
            
            # Append as dictionary to options
            options.append({
                "Title": title,
                "ICD Code": code,
                "Entity ID": entity_id
            })
        
        return options  # Return the list of dictionaries
    
    except requests.RequestException as e:
        print(f"Error during search: {e}")
        if 'response' in locals() and response is not None:
            print(f"Response details: {response.text}")
        return options  # Return empty list on error

# Example usage
disease_query = "cancer"  # Replace with your disease name or description
options = search_disease(disease_query)
print(json.dumps(options, indent=2))  # Print the results as JSON for easy viewing