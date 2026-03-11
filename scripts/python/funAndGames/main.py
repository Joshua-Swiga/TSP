"""
This module contains a class that takes a list of dictionaries
containing transaction information and returns a dictionary with
users as keys and the total amount of transactions as values
"""

class TransactionProcessor:
    def __init__(
                self, 
                transaction_object: list[ dict ] = []
                ):
        """
        Constructor for TransactionProcessor class

        Args:
            transaction_object (list[dict], optional): List of dictionaries containing transaction information. Defaults to an empty list.
        """
        if (transaction_object != None):
            self.transaction_object = transaction_object
        else:
            print('You have provided an empty list!')
            return False

    
    def __str__(self) -> str:
        """
        Returns a string representation of the TransactionProcessor object

        Returns:
            str: A string representation of the TransactionProcessor object
        """
        return f"{self.transaction_object}"
    
    def summarize(
            self
            ) -> dict:
        """
        This function takes a list of dictionaries containing transaction information and returns a dictionary with users as keys and the total amount of transactions as values.

        Args:
            None

        Returns:
            dict: A dictionary with users as keys and the total amount of transactions as values.

        Raises:
            TypeError: If an empty list is provided.
        """
        try:
            
            if (len(self.transaction_object) <= 0):
                raise TypeError('You have provided an empty list!')
            else:
                object_of_user_and_transaction_summary = {}
                for transaction in self.transaction_object:
                    if (transaction['user'] not in object_of_user_and_transaction_summary.keys()):
                        object_of_user_and_transaction_summary[transaction['user']] = transaction['amount']
                    else:
                        object_of_user_and_transaction_summary[transaction['user']] += transaction["amount"]  
                return object_of_user_and_transaction_summary
        except Exception as e:
            print(
                'There was an issue with the summary function: ', e
            )    

custom_transactions = [
    {"user": "alice", "type": "credit", "amount": 300},
    {"user": "bob", "type": "credit", "amount": 200},
    {"user": "alice", "type": "debit", "amount": 150},
    {"user": "alice", "type": "credit", "amount": 100},
]


# class IAmTheBest (TransactionProcessor):

all_locals = locals().copy()
print(__loader__)
# if __name__ == '__main__': 

#     for _ in all_locals:
#         print(_)  
    # testing = TransactionProcessor(custom_transactions)
    # print(testing.summarize())
# else:
#     print('File has been imported. Unable to run')