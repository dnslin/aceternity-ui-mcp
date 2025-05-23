import json
import os
from typing import Any, Dict, List, Optional
from pathlib import Path

from mcp.server.fastmcp import FastMCP

# Initialize FastMCP server
server = FastMCP(
    name="aceternity_ui_assistant",
    title="Aceternity UI Component Assistant",
    description="Helps you find and understand Aceternity UI components.",
    version="0.1.0"
)

# Get the directory where this script is located
SCRIPT_DIR = Path(__file__).parent
MCP_JSON_FILE = SCRIPT_DIR / "mcp.json"
TEMP_JSON_FILE = SCRIPT_DIR / "temp.json"

# If files don't exist in the package directory, try the current working directory
if not MCP_JSON_FILE.exists():
    MCP_JSON_FILE = Path.cwd() / "mcp.json"
if not TEMP_JSON_FILE.exists():
    TEMP_JSON_FILE = Path.cwd() / "temp.json"

def load_components_from_json(file_path: Path, fallback_path: Optional[Path] = None) -> List[Dict[str, Any]]:
    """Loads component data from the specified JSON file."""
    actual_file_to_try = file_path
    if not actual_file_to_try.exists():
        print(f"Warning: Primary data file '{actual_file_to_try}' not found.")
        if fallback_path and fallback_path.exists():
            print(f"Attempting to use fallback data file '{fallback_path}'.")
            actual_file_to_try = fallback_path
        else:
            if fallback_path:
                print(f"Warning: Fallback data file '{fallback_path}' also not found.")
            return []
    
    if not actual_file_to_try.exists():
        print(f"Error: Data file '{actual_file_to_try}' does not exist.")
        return []

    try:
        with open(actual_file_to_try, 'r', encoding='utf-8') as f:
            print(f"Loading components from: {actual_file_to_try.absolute()}")
            return json.load(f)
    except json.JSONDecodeError:
        print(f"Error: Could not decode JSON from {actual_file_to_try}")
        return []
    except Exception as e:
        print(f"An unexpected error occurred while loading {actual_file_to_try}: {e}")
        return []

ALL_COMPONENTS: List[Dict[str, Any]] = load_components_from_json(MCP_JSON_FILE, TEMP_JSON_FILE)
if not ALL_COMPONENTS:
    print(f"Warning: No components loaded. Ensure '{MCP_JSON_FILE.name}' (or '{TEMP_JSON_FILE.name}' as fallback) is present and valid.")

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
        return [{"error": f"Component data ('{MCP_JSON_FILE.name}' or '{TEMP_JSON_FILE.name}') not loaded or empty. Please check server logs."}]

    query_lower = user_query.lower()
    matched_components = []

    for component in ALL_COMPONENTS:
        name_match = component.get("componentName", "").lower()
        desc_match = component.get("description", "").lower()
        tags_match = [str(tag).lower() for tag in component.get("tags", [])]

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
                score +=1

        if score > 0:
            matched_components.append({
                "componentName": component.get("componentName"),
                "description": component.get("description"),
                "tags": component.get("tags"),
                "score": score 
            })

    sorted_matches = sorted(matched_components, key=lambda x: x["score"], reverse=True)
    top_matches = [
        {"componentName": c["componentName"], "description": c["description"], "tags": c["tags"]}
        for c in sorted_matches[:3]
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
        return {"error": f"Component data ('{MCP_JSON_FILE.name}' or '{TEMP_JSON_FILE.name}') not loaded or empty. Please check server logs."}

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
    print(f"Attempting to load component data from '{MCP_JSON_FILE.absolute()}' or fallback '{TEMP_JSON_FILE.absolute()}'.")
    if ALL_COMPONENTS:
        print(f"Successfully loaded {len(ALL_COMPONENTS)} component(s).")
    else:
        print("Failed to load any components. The server might not function as expected.")
    
    server.run(transport='stdio')

if __name__ == "__main__":
    main()