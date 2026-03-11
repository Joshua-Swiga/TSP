def filter_array_based_or_sign_sub_string(array_to_filter: list) -> int:
    if (len(array_to_filter) <= 0):
        return 0
    elif (len(array_to_filter) == 1):
        try:
            return int(array_to_filter[0])
        except TypeError as e:
            return 0
    initial_longest = 0
    current_longest = 0

    
    
    for actual_value in range(len(array_to_filter) - 1):
        if (
            (array_to_filter[actual_value + 1] < 0 and array_to_filter[actual_value] > 0)
            or 
            (array_to_filter[actual_value + 1] > 0 and array_to_filter[actual_value] < 0)
        ):
            initial_longest += 1
        else:
            current_longest = max(current_longest, initial_longest)
            initial_longest = 1
        
    return max(current_longest, initial_longest)
            

            

nums = [1, -2, 3, -4, 5, 6, -7]

outcome = filter_array_based_or_sign_sub_string(
    nums
)

print(outcome)