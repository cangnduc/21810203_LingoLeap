from livekit.agents import (
    AutoSubscribe,
    JobContext,
    JobProcess,
    WorkerOptions,
    cli,
    llm,
)
import asyncio

from livekit import agents, rtc
from livekit.agents.voice_assistant import AssistantCallContext, VoiceAssistant

from mongo import get_products
from typing import Annotated
import logging

logger = logging.getLogger("product-price")
logger.setLevel(logging.INFO)
class AssistantFnc(llm.FunctionContext):
    """This class is used to define functions that will be called by the assistant."""
    @agents.llm.ai_callable(
        description=(
            "Use this function whenever asked to evaluate an image, video, or the webcam feed being shared with you"
                 )
    )
    async def image(self, user_msg: Annotated[str, agents.llm.TypeInfo(description="The user message that triggered this function")],
    ):
        print(f"Message triggering vision capabilities: {user_msg}")
        context = AssistantCallContext.get_current()
        context.store_metadata("user_msg", user_msg)

    
    """
    The class defines a set of LLM functions that the assistant can execute.
    """
    @llm.ai_callable(description="Get the price for a specific product")
    async def get_product_price(self, product_name: Annotated[str, llm.TypeInfo(description="The name of the product to get the price for")]):
        """Called when the user asks about the price for a specific product. This function will return the price for the given product."""
        logger.info(f"getting price for {product_name}")
        products = await get_products(product_name)
        
        if not products:
            return f"Sorry, I couldn't find any products matching '{product_name}'."
        
        if len(products) == 1:
            product = products[0]
            return f"The price for {product['name']} is {product['price']}."
        
        # If multiple products match, return a list of options
        product_list = "\n".join([f"- {p['name']}: {p['price']}" for p in products[:5]])  # Limit to 5 results
        return f"I found multiple products matching '{product_name}'. Here are some options:\n{product_list}\nCould you please specify which one you're interested in?"
     # @llm.ai_callable()
    # async def get_weather(
    #     self,
    #     location: Annotated[
    #         str, llm.TypeInfo(description="The location to get the weather for")
    #     ],
    # ):
    #     """Called when the user asks about the weather. This function will return the weather for the given location."""
    #     logger.info(f"getting weather for {location}")
    #     url = f"https://wttr.in/{location}?format=%C+%t"
    #     async with aiohttp.ClientSession() as session:
    #         async with session.get(url) as response:
    #             if response.status == 200:
    #                 weather_data = await response.text()
    #                 # response from the function call is returned to the LLM
    #                 return f"The weather in {location} is {weather_data}."
    #             else:
    #                 raise f"Failed to get weather data, status code: {response.status}"

    # ... (other methods remain unchanged)

