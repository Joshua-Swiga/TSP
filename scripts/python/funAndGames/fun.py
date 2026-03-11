



def y_smoother(array_to_smooth: list) -> list:
    """
    This function takes a list of tuples containing coordinates and returns a list of tuples with the y-coordinates smoothed.

    The function works by iterating over the list and calculating the average y-coordinate of the current tuple and its adjacent tuples. This average is then used to replace the y-coordinate of the current tuple. The function continues this process until all tuples in the list have been smoothed.

    Args:
        array_to_smooth (list): A list of tuples containing coordinates.

    Returns:
        list: A list of tuples with the y-coordinates smoothed.

    Raises:
        Exception: If an error occurs during the smoothing process, an exception is raised and the error is written to a file named 'errors'. The function then returns None.
    """
    try:        
        first_tuple = True
        current_index = 0
        length_of_list = len(array_to_smooth)
        new_array = []
        array_to_smooth = [
            list(coordinate) for coordinate in array_to_smooth
        ]
        number_of_itterations_made = 0
        for tuple_coordinate in array_to_smooth:
            list(tuple_coordinate)
            if (first_tuple):
                first_tuple = False
                number_of_itterations_made += 1
                continue
            else:
                number_of_itterations_made += 1
                if (number_of_itterations_made != length_of_list):
                    new_y = (
                                array_to_smooth[current_index][1] + 
                                array_to_smooth[current_index + 1][1] + 
                                array_to_smooth[current_index-1][1]
                            ) / 3
                    current_index += 1
                    tuple_coordinate[1] = new_y
        return array_to_smooth
    except Exception as e:
        with open ('errors', "w", encoding='utf-8') as f:
            f.write('Error occured when trying to smooth the array provided: ', e)
            return 

