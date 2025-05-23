# Aceternity UI Component Assistant

[![Python Version](https://img.shields.io/badge/python-^3.13-blue.svg)](https://www.python.org/)
[![Project Version](https://img.shields.io/badge/version-0.1.0-green.svg)](aceternity/pyproject.toml)

The Aceternity UI Component Assistant is a project designed to help users easily find and integrate Aceternity UI components. It provides an MCP (Model Context Protocol) server that allows for quick searching and retrieval of detailed component information.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  - [Running the Server](#running-the-server)
  - [Interacting with the Server](#interacting-with-the-server)
- [Component Reference](#component-reference)
- [Contributing](#contributing)
- [Workflow](#workflow)

## Features

- **Component Discovery**: Find Aceternity UI components using natural language queries.
- **Detailed Information**: Get comprehensive details for specific components, including:
  - Name
  - Description
  - Tags
  - Code Snippets
  - Installation Commands
  - Props/API
- **Centralized Data**: Component information is loaded from a structured JSON file ([`aceternity/aceternity/mcp.json`](aceternity/aceternity/mcp.json)).
- **MCP Server**: Exposes functionality through a standard MCP interface.

## Installation

1. **Clone the repository (if you haven't already):**

    ```bash
    git clone <your-repository-url>
    cd aceternity
    ```

2. **Ensure you have Python 3.13 or higher.** You can check your Python version with:

    ```bash
    python --version
    ```

3. **Install the project and its dependencies:**
    It's recommended to use a virtual environment.

    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    pip install .
    ```

    This command installs the package based on the [`pyproject.toml`](aceternity/pyproject.toml) file.

## Usage

### Running the Server

Once installed, you can start the Aceternity UI Component Assistant MCP server using the following command:

```bash
aceternity-mcp-server
```

The server will then be ready to accept requests from an MCP client.

### Interacting with the Server

You can interact with the server using any MCP-compatible client. Here are pseudo-code examples of how to use the available tools:

**1. Find Aceternity Component (`find_aceternity_component`)**

This tool allows you to search for components based on a natural language query.

- **Input**: `user_query` (string) - Your description of the desired component.
- **Output**: A list of matching components with their name, description, and tags.

*Example (Pseudo-code):*

```python
# Assuming 'client' is an initialized MCP client

# Find components related to "animated cards"
response = client.call_tool(
    server_name="aceternity_ui_assistant",
    tool_name="find_aceternity_component",
    arguments={"user_query": "animated cards"}
)

if response and not response[0].get("error"):
    for component in response:
        print(f"Name: {component['componentName']}")
        print(f"Description: {component['description']}")
        print(f"Tags: {', '.join(component['tags'])}\n")
else:
    print(f"Error or no components found: {response}")
```

**2. Get Aceternity Component Details (`get_aceternity_component_details`)**

This tool retrieves detailed information for a specific component by its name.

- **Input**: `component_name` (string) - The exact name of the component.
- **Output**: A dictionary containing the component's name, description, tags, code, CLI installation command, and props.

*Example (Pseudo-code):*

```python
# Assuming 'client' is an initialized MCP client

# Get details for "3D Card Effect"
component_details = client.call_tool(
    server_name="aceternity_ui_assistant",
    tool_name="get_aceternity_component_details",
    arguments={"component_name": "3D Card Effect"}
)

if component_details and not component_details.get("error"):
    print(f"Component Name: {component_details['componentName']}")
    print(f"Description: {component_details['description']}")
    print(f"Tags: {component_details['tags']}")
    print(f"Code Snippet: \n{component_details['code']}")
    print(f"Install Command: {component_details['cliInstallCommand']}")
    print("Props:")
    for prop in component_details.get('props', []):
        print(f"  - {prop.get('prop')}: {prop.get('type')} (Default: {prop.get('default')}) - {prop.get('description')}")
else:
    print(f"Error or component not found: {component_details}")

```

## Component Reference

All detailed information about the Aceternity UI components, including their names, descriptions, tags, code examples, installation commands, and properties, is defined in the [`aceternity/aceternity/mcp.json`](aceternity/aceternity/mcp.json) file within this project.

You can retrieve the full details for any specific component programmatically by using the `get_aceternity_component_details` tool provided by the MCP server, as shown in the [Usage](#usage) section.

## Contributing

We welcome contributions from the community! Whether it's reporting a bug, suggesting a new feature, or submitting a pull request, your help is appreciated.

- **Reporting Issues**: If you encounter any bugs or issues, please open an issue on our GitHub repository. Provide as much detail as possible, including steps to reproduce the issue.
- **Feature Requests**: If you have ideas for new features or improvements, feel free to open an issue to discuss them.
- **Pull Requests**: We are happy to review pull requests. For major changes, please open an issue first to discuss what you would like to change. Please ensure your code adheres to any existing style guidelines.

## Workflow

The following diagram illustrates the typical interaction flow with the Aceternity UI Component Assistant:

```mermaid
sequenceDiagram
    participant User
    participant MCPClient as MCP Client
    participant AceternityServer as Aceternity UI Assistant Server

    User->>MCPClient: I need an animated card component.
    MCPClient->>AceternityServer: find_aceternity_component(user_query="animated card")
    AceternityServer-->>MCPClient: List of matching components
    MCPClient-->>User: Shows list (e.g., "3D Card Effect", "Animated Modal")

    User->>MCPClient: Get details for "3D Card Effect".
    MCPClient->>AceternityServer: get_aceternity_component_details(component_name="3D Card Effect")
    AceternityServer-->>MCPClient: Detailed component info (code, props, etc.)
    MCPClient-->>User: Shows component details
