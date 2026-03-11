from custom_info import *
import time

def register_student() -> None:
    print("\n")
    if (student_information['First Name'] == None):
            
        print(
            """
            Welcome to Swiga's School of Greatness!
            """
        )
        print("\n")
        done_attempts = 0

        first_name = str(input("Student First Name: "))
        if (not isinstance(first_name, str)):
            done_attempts += 1
            print("Please provide a valid first name")
            register_student()
        
        second_name = str(input("Student Second Name: "))
        if (not isinstance(second_name, str)):
            done_attempts += 1
            print("Please provide a valid second name")
            register_student()
        
        last_name = str(input("Student Last Name: "))
        if (not isinstance(last_name, str)):
            done_attempts += 1
            print("Please provide a valid last name")
            register_student()
        
        age = int(input("Student Age: "))
        if age < 18:
            print(
                f"Student is bellow the legal age requirement. Please try again in {18 - age} years."
                )
            return
        print(
            "\n"
        )
        print(
            "Please wait while we process your info"
        )
        time.sleep(2)
        print(
                "\n"
            )
        student_information['First Name'] = first_name
        student_information['Second Name'] = second_name
        student_information['Last Name'] = last_name
        student_information['Age'] = age
    else:
        print(f"""
                Dear {student_information['First Name']}, Welcome back to Swiga's School of Greatness!
                """)
        
    current_corse = 1
    for corse in corses_offered:
        print(f"{current_corse}: {corse}")
        current_corse += 1
    
    print(
        "\n"
    )
    corse = int(input(
        "Please select a corse from the options above: "
    ))

    if (corse > len (corses_offered) or corse < 0):
        corse = int(input(f"Please select a valid corse number! Range should be within 1 to {len(corses_offered)}: "))

    student_information['Course'] = corse
    student_information['School Fees'] = 100000
    student_information['Fees Paid So Far'] = 0 
    print(
        "\n"
    )
    print("Processing ...")
    time.sleep(2)
    print(f"""
            Dear {student_information['First Name']}, Registration for {corses_offered[student_information['Course'] - 1]} is complete!
            Your required fee is {student_information['School Fees']}. 
            """)
    next_action = str(input("Would you like to prceed to payment? ")).lower()
    if (next_action.strip() == 'yes'):
        allow_payment_for_student('reg')

def allow_payment_for_student(context: str = None) -> bool:
    if context == 'grad':
        print(
            '\n'
        )
        print("You are about to graduate! However, you are yet to clear your fees!")
        time.sleep(2)
    elif (context == 'reg'):
        amount_to_pay = input("Please select an amount you would like to pay: ")



    if (int(amount_to_pay)):
        student_information['Fees Paid So Far'] = amount_to_pay
        return True
    else:
        print("Please provide a valid amount!")
        allow_payment_for_student()
    return False

def check_if_fee_is_not_finished():
    if (
        student_information['Fees Paid So Far'] < student_information['School Fees']
    ):
        prompt_student_to_pay_fees()


def check_on_the_students_class_attendance():
    number_of_checks_required = 10
    summary_of_each_class = {}
    
    while number_of_checks_required != 0:
        class_name = str(input("What is the name of the class you attended? "))

        if (len(class_name) < 5):
            print("Please provide a valid class name")
        else:
            summary_of_the_class = str(input("Please provide a summary of what you learned: "))
            if len(summary_of_the_class) < 20:
                print("Please provide a valid summary of the class: ")
            else:
                summary_of_each_class[class_name] = summary_of_the_class
                number_of_checks_required -= 1
                class_name = None
                summary_of_the_class = None
                student_information['Number of Classes Attended'] += 1
                has_paid = allow_payment_for_student()


def prompt_student_to_pay_fees():
    print(
        "You are required to pay your fees!"
    )
    has_paid_their_fees = allow_payment_for_student()

    
def deny_student_from_proceeding_because_of_late_fees():
    pass

def execute_workflow_for_school_process():
    pass

def enter_student_exam_results():
    is_qualified = check_if_fee_is_not_finished()
    if (is_qualified):
        score_on_the_test = input("What has the student scored? ")
        remarks_on_test = input("Remarks on how the student performed: ")
        passed = input("Has the student passed? (yes/no): ").lower
        student_information['Remarks On Scores'] = remarks_on_test
        student_information['Test Score'] = score_on_the_test
        if (passed == 'yes'):
            student_information['Has Passed'] = True
        else:
            student_information['Has Passed'] = False
        allow_student_to_graduate()

def allow_student_to_graduate():
    if (student_information['Has Passed']):
        can_graduate = check_if_fee_is_not_finished()
        while (can_graduate != True):
            allow_payment_for_student('grad')
        print(f"""
                Congratulations {student_information['First Name']}! You have passed your {student_information['Corse']} corse!
                Here are the remarks from your registra: {student_information['Remarks On Scores']}
                """)
        print('\n')
        next_action = input("Would you like to take another corse? (yes/no): ").strip().lower()
        if (next_action == 'yes'):
            register_student()
if __name__ == '__main__':
    register_student()
    
