def even_pattern(number: int ) -> None:
    # Designing a mirror pattern based on the range of appearance 
    if (number > 0):
        for appearance in range (0, number + 1):
            print(
                "*" * number
            )
    else:
        # Printing just the number to save on operational cost and load
        print("*")

def odd_pattern(number: int) -> None:
    if (number > 0):
        next_line = 1
        space = ""
        for h in range (0, number + 1):
            print(
                space, "*" * next_line
            )
            next_line += 1
            space += " "
    else:
        print("*")
odd_pattern(10)
def by_3_pattern() -> None:
    pass

def prime_pattern() -> None:
    pass


def identify_pattern(
        n: int
        ) -> None:
    try: 
        if not isinstance(n, int):
            raise TypeError ('Please provide a valid type: ', type(n))
        
        if ((n / 2) == 0):
            even_pattern(n)
        elif ((n / 2) != 0):
            odd_pattern(n)
        elif ((n / 3) == 0):
            by_3_pattern(n)
        else:
            prime_pattern(n)

    except Exception as e:
        print(f"There was an issue with the function: {e}")
        return None
    
# if (__name__ == "__main__"):
#     user_input = int(input("Please provide a valid number: "))
#     identify_pattern(user_input)