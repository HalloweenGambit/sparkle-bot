# Discord RAG Bot with Gemini Key

## Overview

This Discord bot leverages **Retrieval-Augmented Generation (RAG)** and **Gemini** to provide answers to user questions by searching a database. It formats user queries, creates text embeddings, and uses similarity matching to deliver accurate responses. Admins can also easily add relevant data to the database using special emojis for streamlined content management.

## How It Works

1. **User Interaction**:
   - A user asks a question in the Discord chat using a `?`.
2. **Preprocessing**:

   - The bot captures the question and preprocesses it, formatting the text into a schema-ready reply.

3. **Save to Database**:

   - The question is saved to the database, and the bot creates an embedding of the text from its tokens.

4. **Embedding Storage**:

   - Both the question and its embedding are stored in the database.

5. **Similarity Search**:

   - The bot searches the database for similar questions.
   - If no exact match is found, it searches for similarity in embeddings of FAQ items.

6. **Response**:

   - If a match with a similarity score of over 0.80 is found, the bot responds to the user with the relevant answer.
   - If no match is found, the process ends without a response.

7. **Admin Data Management**:
   - Admins can add items to the database by appending a **sparkle emoji (✨)** to the text they want to be used as a response.
   - The bot uses Gemini to generate 10 potential questions that could lead to this response.
   - The bot confirms the addition or removal of data by using or removing the **check emoji (✅)** by default.
   - Additional configuration options, such as linking, can be customized via the configuration file.

## Features

- **Retrieval-Augmented Generation (RAG)**: Combines retrieval from the database with generative techniques for accurate responses.
- **Gemini Integration**: Uses a secure Gemini key to perform complex database queries and text generation.
- **Text Embeddings**: Converts questions into embeddings to compare against stored questions and FAQ items for similarity-based responses.
- **Admin Controls via Emojis**: Allows admins to quickly add or remove potential responses from the database with emoji-based commands.

## Installation

### Prerequisites

- Node.js (v14 or higher)
- Discord bot token
- Gemini API key
- Supabase Database setup

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/HalloweenGambit/sparkle-bot.git
   cd discord-rag-bot
   ```

## License

© 2024 0xjariel

This project is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0). Even if the software is copied and modified, it may not be used for any commercial purpose. See the [LICENSE](./LICENSE) file for details.

[![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC%20BY--NC%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc/4.0/)
