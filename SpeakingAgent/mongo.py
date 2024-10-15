from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
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
