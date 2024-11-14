for file in curl_commands/*.sh; do
    echo "Running $file..."
    
    # Run the curl command in each file
    bash "$file"
    
   

    echo "---------------------------"
    read -p "Press Enter to continue to the next file..."
done