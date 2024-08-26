## Overview

Here lies the code behind a project that was built to improve WaniKani lessons by supplementing them with AI-generated mnemonic visuals. 

If you would like to know more about this project, please read the [article](https://www.spiritedplan.com/ai-visuals-japanese) I wrote about it. 

I welcome anyone from the WaniKani community or otherwise to contribute. 

If you would like to add/help/fix something, please open up a PR and I will get in touch. 

If you have questions about the project itself or would like to discuss improvements. Please feel free to send me an email. 


## Navigation
This repo is split into two projects.

`chrome-extension` is (as named) the chrome extension that displays images on wanikani pages. 

`image-generation` is the python script that connects to OpenAI and generates mnemonic images. 


## Chrome Extension


Loading the extension yourself:

Go to the Chrome Extensions page by entering `chrome://extensions` in a new tab.

Alternatively, click the Extensions menu puzzle button and select Manage Extensions at the bottom of the menu. Or, click the Chrome menu, hover over More Tools, then select Extensions.

Enable Developer Mode by clicking the toggle switch next to Developer mode.

Click the `Load unpacked` button and select the extension directory. 


## Image Generation:


To run image generation for yourself:

1. Generate a `.env` file in the `image-generation` directory with this format:

```
OPENAI_API_KEY="API Key"
OPENAI_ASSISTANT_ID="Assistant ID
```

2. Start a python virtual environment with the following commands:
```bash
% python -m venv venv/kaniai
% . venv/kaniai/bin/activate
```
3. Install pip and the python libraries with the command:
```
% pip install -r requirements.txt
```
4. Run the script with 
```
python image-generation.py
```

*Note:* The image generation script creates a directory at the root called `temp` when run. THis is where images get stored and the error log and kanji CSVs are written. On successive runs, you need to delete this folder (and if generating many images, be mindfuyl of disk space).