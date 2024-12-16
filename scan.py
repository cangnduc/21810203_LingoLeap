import os
from pathlib import Path
import json

def scan_directory(directory_path, exclude_folders=None):
    """
    Recursively scan a directory and return its simplified structure.
    
    Args:
        directory_path (str): Path to the directory to scan
        exclude_folders (list): List of folder names to exclude from scanning
    
    Returns:
        dict: A simplified nested dictionary representing the directory structure
    """
    # Default to an empty list if no exclusions are provided
    if exclude_folders is None:
        exclude_folders = []
    
    # Convert exclude_folders to a set for faster lookups
    exclude_set = set(exclude_folders)

    def explore_directory(path):
        """
        Recursively explore directory structure.
        
        Args:
            path (Path): Current path to explore
        
        Returns:
            dict: Simplified nested structure of files and subdirectories
        """
        structure = {}
        
        try:
            # Iterate through all entries in the directory
            for entry in os.scandir(path):
                # Skip folders in the exclude list
                if entry.is_dir():
                    if entry.name not in exclude_set:
                        structure[entry.name] = explore_directory(Path(entry.path))
                else:
                    structure[entry.name] = entry.name
        
        except Exception as e:
            structure["error"] = str(e)
        
        return structure

    # Convert input to Path object and validate
    directory = Path(directory_path)
    if not directory.is_dir():
        raise ValueError(f"The path {directory_path} is not a valid directory")

    # Scan the directory and return the structure
    return {os.path.basename(directory_path): explore_directory(directory)}

def save_structure_to_json(structure, output_file):
    """
    Save directory structure to a JSON file.
    
    Args:
        structure (dict): Directory structure to save
        output_file (str): Path to output JSON file
    """
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(structure, f, indent=2, ensure_ascii=False)

def print_directory_structure(structure, indent=0):
    """
    Pretty print the directory structure with indentation.
    
    Args:
        structure (dict): Directory structure to print
        indent (int): Current indentation level
    """
    def _print_structure(item, current_indent):
        indent_str = "  " * current_indent
        
        for name, contents in item.items():
            if isinstance(contents, dict):
                print(f"{indent_str}{name}/")
                _print_structure(contents, current_indent + 1)
            else:
                print(f"{indent_str}{name}")

    _print_structure(structure, indent)

# Example usage
if __name__ == "__main__":
    # Replace with the path you want to scan
    scan_path = "./SpeakingAgent"
    
    # List of folders to exclude
    exclude_folders = [
        ".git", "__pycache__", "node_modules", ".vscode", 
        ".idea", "venv", ".env", "logs", "temp", "agents", "EnglishExam"
    ]
    
    try:
        # Scan the directory with exclusion list
        directory_structure = scan_directory(scan_path, exclude_folders)
        
        # Print the structure to console
        print("Directory Structure:")
        print_directory_structure(directory_structure)
        
        # Save to JSON
        save_structure_to_json(directory_structure, "SpeakingAgent.json")
        
    except Exception as e:
        print(f"An error occurred: {e}")