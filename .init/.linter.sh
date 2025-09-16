#!/bin/bash
cd /home/kavia/workspace/code-generation/quoteextractor-platform-29-38/quote_extraction_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

