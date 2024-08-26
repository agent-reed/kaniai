from openai import OpenAI
import requests
import csv   
import os
import time
import kanji_list
from dotenv import load_dotenv

# Load the .env file
load_dotenv()

openai_client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

def generate_prompt(client, kanji):
    try:
        print(f">>>>> Generating Prompt for {kanji}")
        # Initialize OpenAI client
        thread = client.beta.threads.create()
        
        # Add a message to the thread with the Kanji to generate
        client.beta.threads.messages.create(
            thread_id=thread.id,
            role="user",
            content=kanji
        )

        # Run the thread    
        run = client.beta.threads.runs.create_and_poll(
            thread_id=thread.id,
            assistant_id=os.environ.get("OPENAI_ASSISTANT_ID"),
        )

        # Wait for prompt to finish
        if run.status == 'completed': 
            messages = client.beta.threads.messages.list(
                thread_id=thread.id
            )
            prompt_text = messages.data[0].content[0].text.value
            
            return prompt_text
        
        else:
            raise Exception("Prompt Generation Failed - Status Incomplete")

    except Exception as e:
        print(f"Error generating prompt. {e}")
        raise

def generate_image(client, kanji, dalle_prompt):
    try:
        print(f">>>>> Generating Image for {kanji}\n")
        image_response = client.images.generate(
            model="dall-e-3",
            prompt=dalle_prompt,
            size="1024x1024",
            quality="standard",
            n=1,
        )

        image_url = image_response.data[0].url

        img_data = requests.get(image_url).content
        with open(f'temp/images/{kanji}.png', 'wb') as handler:
            handler.write(img_data)

        return image_url

    except Exception as e:
        raise Exception(f"Error generating image. {e}")

def log_kanji_to_csv(kanji, prompt, image_url):
    fields=[kanji, prompt, image_url]
    with open('temp/kanji_log.csv', 'a') as f:
        writer = csv.writer(f)
        writer.writerow(fields)

def log_kanji_problem(kanji, e):
    fields=[kanji, e]
    print(f'{e}')
    with open('temp/kanji_errors.csv', 'a') as f:
        writer = csv.writer(f)
        writer.writerow(fields)

# Main execution
error_count = 0
            
# Calculate time taken
start = time.time()

if not os.path.exists('/temp'):
    os.makedirs('temp')
    os.makedirs('temp/images')

for kanji in kanji_list.kanji:
    if error_count > 10: 
        break

    try:
        prompt = generate_prompt(openai_client, kanji)
        image_url = generate_image(openai_client, kanji, prompt)
        log_kanji_to_csv(kanji, prompt, image_url)

    except Exception as e:
        log_kanji_problem(kanji, e)
        error_count = error_count + 1

end = time.time()
length = end - start
print(f'Total Run Time: {length}')