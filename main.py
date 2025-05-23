import json
import os
from typing import Any, Dict, List, Optional

from mcp.server.fastmcp import FastMCP

# Initialize FastMCP server
server = FastMCP(
    name="aceternity_ui_assistant",
    title="Aceternity UI Component Assistant",
    description="Helps you find and understand Aceternity UI components.",
    version="0.1.0"
)

# Assume mcp.json and temp.json are in the same directory as this script (i.e., inside 'aceternity' folder)
MCP_JSON_FILE = "mcp.json"
TEMP_JSON_FILE = "temp.json" # For fallback

def load_components_from_json(file_path: str, fallback_path: Optional[str] = None) -> List[Dict[str, Any]]:
    """Loads component data from the specified JSON file."""
    actual_file_to_try = file_path
    if not os.path.exists(actual_file_to_try):
        print(f"Warning: Primary data file '{actual_file_to_try}' not found in '{os.getcwd()}'.")
        if fallback_path and os.path.exists(fallback_path):
            print(f"Attempting to use fallback data file '{fallback_path}'.")
            actual_file_to_try = fallback_path
        else:
            if fallback_path:
                print(f"Warning: Fallback data file '{fallback_path}' also not found.")
            return []
    
    if not os.path.exists(actual_file_to_try): # Check again if fallback was also not found
        print(f"Error: Data file '{actual_file_to_try}' does not exist.")
        return []

    try:
        with open(actual_file_to_try, 'r', encoding='utf-8') as f:
            print(f"Loading components from: {os.path.abspath(actual_file_to_try)}")
            return json.load(f)
    except json.JSONDecodeError:
        print(f"Error: Could not decode JSON from {actual_file_to_try}")
        return []
    except Exception as e:
        print(f"An unexpected error occurred while loading {actual_file_to_try}: {e}")
        return []

ALL_COMPONENTS: List[Dict[str, Any]] = load_components_from_json(MCP_JSON_FILE, TEMP_JSON_FILE)
if not ALL_COMPONENTS:
    print(f"Warning: No components loaded. Ensure '{MCP_JSON_FILE}' (or '{TEMP_JSON_FILE}' as fallback) is present and valid in the 'aceternity' directory.")

@server.tool()
async def find_aceternity_component(user_query: str) -> List[Dict[str, Any]]:
    """
    Finds Aceternity UI components based on a user's natural language query.
    Searches component names, tags, and descriptions.

    Args:
        user_query: The user's query describing the desired UI component or effect.

    Returns:
        A list of matching components, each containing 'componentName', 'description', and 'tags'.
        Returns an error message if no components match or if data is unavailable.
    """
    if not ALL_COMPONENTS:
        return [{"error": f"Component data ('{MCP_JSON_FILE}' or '{TEMP_JSON_FILE}') not loaded or empty. Please check server logs."}]

    query_lower = user_query.lower()
    matched_components = []

    for component in ALL_COMPONENTS:
        name_match = component.get("componentName", "").lower()
        desc_match = component.get("description", "").lower()
        tags_match = [str(tag).lower() for tag in component.get("tags", [])] # Ensure tags are strings

        score = 0
        query_words = set(query_lower.split())
        
        name_words = set(name_match.split())
        desc_words = set(desc_match.split())
        
        # Score based on query words found in fields
        if query_words.intersection(name_words):
            score += len(query_words.intersection(name_words)) * 3
        if query_words.intersection(desc_words):
            score += len(query_words.intersection(desc_words)) * 2
        
        for tag_str in tags_match:
            if any(qw in tag_str for qw in query_words):
                score +=1 # Simple increment for tag match

        if score > 0:
            matched_components.append({
                "componentName": component.get("componentName"),
                "description": component.get("description"),
                "tags": component.get("tags"),
                "score": score 
            })

    sorted_matches = sorted(matched_components, key=lambda x: x["score"], reverse=True)
    # Return only name, description, and tags for the top N matches
    top_matches = [
        {"componentName": c["componentName"], "description": c["description"], "tags": c["tags"]}
        for c in sorted_matches[:3] # Return top 3 matches
    ]
    
    if not top_matches:
        return [{"info": f"No components found matching your query: '{user_query}'"}]
        
    return top_matches

@server.tool()
async def get_aceternity_component_details(component_name: str) -> Dict[str, Any]:
    """
    Retrieves detailed information for a specific Aceternity UI component by its name.

    Args:
        component_name: The exact name of the component.

    Returns:
        A dictionary containing the component's 'componentName', 'description',
        'tags', 'code', 'cliInstallCommand', and 'props'.
        Returns an error message if the component is not found or if data is unavailable.
    """
    if not ALL_COMPONENTS:
        return {"error": f"Component data ('{MCP_JSON_FILE}' or '{TEMP_JSON_FILE}') not loaded or empty. Please check server logs."}

    for component in ALL_COMPONENTS:
        if component.get("componentName") == component_name:
            return {
                "componentName": component.get("componentName"),
                "description": component.get("description"),
                "tags": component.get("tags"),
                "code": component.get("code"),
                "cliInstallCommand": component.get("cliInstallCommand"),
                "props": component.get("props")
            }
    return {"error": f"Component '{component_name}' not found."}

def main():
    print("Starting Aceternity UI Component Assistant MCP Server...")
    print(f"Attempting to load component data from '{os.path.abspath(MCP_JSON_FILE)}' or fallback '{os.path.abspath(TEMP_JSON_FILE)}'.")
    if ALL_COMPONENTS:
        print(f"Successfully loaded {len(ALL_COMPONENTS)} component(s).")
    else:
        print("Failed to load any components. The server might not function as expected.")
    
    # To run this server for development with MCP Inspector:
    # In 'aceternity' directory (after activating venv and installing deps): mcp dev main.py
    #
    # To run it as a stdio server:
    # In 'aceternity' directory: uv run main.py
    server.run(transport='stdio')

if __name__ == "__main__":
    main()
