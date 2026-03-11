file_to_read = r'scripts\python\unfiltered_questions'
sql_file = r'scripts\python\structured_sql_queries'
array_of_questions = []
with open(file_to_read, 'r', encoding='utf-8') as f:
    lines = f.readlines()
    for line in lines:
        if (line != '\n'):
            escaped_line = line.strip('\n').lower().upper().replace("'", "''")
            array_of_questions.append('INSERT INTO public.question (actual_question, game_id) VALUES' + f"('{escaped_line}', 1);")
print(len(array_of_questions))

with open (sql_file, 'w', encoding='utf-8') as file_to_write:
    for question in array_of_questions:
        file_to_write.write(question+'\n')