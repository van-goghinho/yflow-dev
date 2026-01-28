import requests
import json

# --- CONFIGURATION ---
TOKEN = 'figd_M9xjDJ4lE4FydV7JMOa5C0jT82eUKMi2cLI5GE8e' #expire le 28/04/2026
FILE_KEY = 'LFGoVUDSE0NvxwVcj5aZ2t'

def export_figjam_workflow():
    url = f"https://api.figma.com/v1/files/{FILE_KEY}"
    headers = {"X-Figma-Token": TOKEN}

    print("🚀 Extraction du workflow FigJam...")
    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        full_data = response.json()
        
        # On va filtrer pour ne garder que les éléments intéressants du workflow
        workflow_elements = []
        
        # Parcours récursif pour trouver les nœuds (FigJam peut avoir des sections)
        def find_nodes(node):
            # Types spécifiques à FigJam
            if node.get('type') in ['STICKY', 'SHAPE_WITH_TEXT', 'TEXT']:
                # On récupère le texte à l'intérieur
                text_content = ""
                if 'characters' in node: # Pour les textes simples
                    text_content = node['characters']
                elif 'children' in node: # Chercher le texte dans les enfants (souvent le cas)
                    for child in node['children']:
                        if 'characters' in child:
                            text_content = child['characters']
                
                workflow_elements.append({
                    "id": node['id'],
                    "type": node['type'],
                    "text": text_content,
                    "color": node.get('fills', [{}])[0].get('color', 'N/A')
                })
            
            # Pour les flèches (Connecteurs)
            elif node.get('type') == 'CONNECTOR':
                workflow_elements.append({
                    "id": node['id'],
                    "type": "CONNECTOR",
                    "from": node.get('connectorStart', {}).get('endpointNodeId'),
                    "to": node.get('connectorEnd', {}).get('endpointNodeId'),
                    "label": node.get('characters', '')
                })

            if 'children' in node:
                for child in node['children']:
                    find_nodes(child)

        find_nodes(full_data['document'])

        # Sauvegarde
        output = {
            "file_name": full_data['name'],
            "elements": workflow_elements
        }
        
        with open("mon_workflow.json", "w", encoding="utf-8") as f:
            json.dump(output, f, indent=4, ensure_ascii=False)
        
        print(f"✅ Terminé ! {len(workflow_elements)} éléments extraits dans mon_workflow.json")
    else:
        print(f"❌ Erreur : {response.status_code}")

if __name__ == "__main__":
    export_figjam_workflow()