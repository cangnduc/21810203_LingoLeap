from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from bson import ObjectId
from bson.errors import InvalidId
import asyncio
import re
import os
from dotenv import load_dotenv

# Get the current file's directory
current_dir = os.path.dirname(os.path.abspath(__file__))

# Construct the path to the .env file (assuming it's two levels up)
env_path = os.path.join(current_dir, '..', '.env')

# Load the .env file
load_dotenv(dotenv_path=env_path)

def parse_speaking_result(result_string):
    """Parse the speaking result string into a structured object"""
    lines = result_string.strip().split('\n')
    speaking_result = {}
    
    # Parse scores
    for line in lines:
        if 'Fluency:' in line:
            speaking_result['fluency'] = float(line.split(':')[1].strip())
        elif 'Pronunciation:' in line:
            speaking_result['pronunciation'] = float(line.split(':')[1].strip())
        elif 'Vocabulary:' in line:
            speaking_result['vocabulary'] = float(line.split(':')[1].strip())
        elif 'Overall communication:' in line:
            speaking_result['overallCommunication'] = float(line.split(':')[1].strip())
        elif 'Total score:' in line:
            speaking_result['totalScore'] = float(line.split(':')[1].strip())
        elif 'Feedback:' in line:
            # Get everything after "Feedback:" for the feedback field
            speaking_result['feedback'] = ':'.join(line.split(':')[1:]).strip()
    
    return speaking_result

async def save_speaking_result(test_attempt_id, speaking_result_string):
    uri = os.getenv("DB_MONGO_URI")
    client = MongoClient(uri, server_api=ServerApi('1'))
    db = client.EnglishTest
    test_result_collection = db.testresults
    
    try:
        # Convert string ID to ObjectId
        try:
            test_attempt_object_id = ObjectId(test_attempt_id)
        except InvalidId:
            print(f"Invalid ObjectId format: {test_attempt_id}")
            return
            
        # Parse the speaking result string into an object
        speaking_result_object = parse_speaking_result(speaking_result_string)
        print("Parsed speaking result:", speaking_result_object)
        
        existing_test_result = test_result_collection.find_one(
            {"testAttempt": test_attempt_object_id}
        )
        
        if existing_test_result:
            test_result_collection.update_one(
                {"testAttempt": test_attempt_object_id}, 
                {"$set": {"speakingResult": speaking_result_object}}
            )
        else:
            test_result_collection.insert_one({
                "testAttempt": test_attempt_object_id, 
                "speakingResult": speaking_result_object
            })
            
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        client.close()


async def get_products(search_term=None):
    # Get MongoDB URI from environment variable
    uri = os.getenv("DB_MONGO_URI")

    # Create a new client and connect to the server
    client = MongoClient(uri, server_api=ServerApi('1'))

    try:
        # Send a ping to confirm a successful connection
        client.admin.command('ping')
        print("Pinged your deployment. You successfully connected to MongoDB!")
        
        # Get database
        db = client.Shopdev  # Changed from shopdev to EnglishTest

        # Get collection
        products = db.products

        # Create a query that searches for the term in the name field
        query = {}
        if search_term:
            query['name'] = re.compile(search_term, re.IGNORECASE)

        # Fetch products with the query
        product_list = list(products.find(query, {'_id': 1, 'name': 1, 'price': 1}))

        return product_list

    except Exception as e:
        print(f"An error occurred: {e}")
        return []

    finally:
        client.close()



# If you want to test the function within this file
if __name__ == "__main__":
    search_term = "iphone"  # You can change this to test different searches
    products = asyncio.run(get_products(search_term))
    for product in products:
        print(product)
