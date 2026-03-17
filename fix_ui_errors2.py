import re

def fix_file(file_path):
    with open(file_path, "r") as f:
        content = f.read()

    # Replace <CardHeader ...> with <div className="mb-4 ...">
    content = re.sub(r'<CardHeader([^>]*)>', r'<div className="mb-4"\1>', content)
    
    # Replace <CardTitle ...> with <h3 className="text-lg font-semibold text-[#E5E7EB]" ...>
    content = re.sub(r'<CardTitle([^>]*)>', r'<h3 className="text-lg font-semibold text-[#E5E7EB]"\1>', content)
    
    # Replace <CardContent ...> with <div ...>
    content = re.sub(r'<CardContent([^>]*)>', r'<div\1>', content)

    with open(file_path, "w") as f:
        f.write(content)

fix_file("frontend/src/components/profile/StatsIntegrationPanel.tsx")
fix_file("frontend/src/pages/AssessmentPage.tsx")

print("Done")
