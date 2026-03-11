def returns_true_when_sum_of_associates_match_target(associates: list, target: int = None)->bool:
    if (len(associates) <= 0):
        return False
    
    for number in associates:
        for next_number in associates:
            if ((number + next_number) == target):
                return True
            else:
                return False
            
nums = [4, 7, 1, -3, 2]
target_value = 5
outcome = returns_true_when_sum_of_associates_match_target(
    nums, target=target_value
)

print(outcome)