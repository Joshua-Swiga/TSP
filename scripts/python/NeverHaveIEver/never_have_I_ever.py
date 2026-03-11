import re

file = r"/home/swiga/Desktop/Code/TSP/play-or-pay-monorepo/play-or-pay/scripts/python/NeverHaveIEver/unstructuredQuestions.txt"
structured_file = r"/home/swiga/Desktop/Code/TSP/play-or-pay-monorepo/play-or-pay/scripts/python/NeverHaveIEver/never_have_I_sql.txt"
sql_list_for_game = []
with open(file, 'r') as f:
    questions = f.read().splitlines()
    for question in questions:
        if question.strip() != "":
            clean_question = re.sub(r'^\d+\.\s*', '', question.strip())
            sql_list_for_game.append(
                "INSERT INTO public.question (actual_question, game_id) VALUES('" + clean_question + "', 2);"
                )
            
with open (structured_file, 'w') as structured_question:
    for sql in sql_list_for_game:
        structured_question.write(sql + "\n")
print("Done writing SQL statements to file.")