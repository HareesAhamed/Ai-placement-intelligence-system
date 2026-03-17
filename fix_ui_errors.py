import os
import re

# 1. Fix src/components/profile/StatsIntegrationPanel.tsx
file_path = "frontend/src/components/profile/StatsIntegrationPanel.tsx"
with open(file_path, "r") as f:
    content = f.read()

content = content.replace("import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';", "import { Card } from '../ui/Card';")
content = content.replace("import { fetchExternalStats, syncExternalStats } from '../services/api';", "import { fetchExternalStats, syncExternalStats } from '../../services/api';")

content = content.replace("<CardHeader>", "<div className=\"mb-4\">")
content = content.replace("</CardHeader>", "</div>")
content = content.replace("<CardTitle>", "<h3 className=\"text-lg font-semibold text-[#E5E7EB]\">")
content = content.replace("</CardTitle>", "</h3>")
content = content.replace("<CardContent>", "<div>")
content = content.replace("</CardContent>", "</div>")

with open(file_path, "w") as f:
    f.write(content)

# 2. Fix src/pages/AssessmentPage.tsx
file_path = "frontend/src/pages/AssessmentPage.tsx"
with open(file_path, "r") as f:
    content = f.read()

content = content.replace("import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';", "import { Card } from '../components/ui/Card';")
content = content.replace("import SectionHeader from '../components/ui/SectionHeader';", "import { SectionHeader } from '../components/ui/SectionHeader';")
content = content.replace("import api from '../services/api';", "import api from '../services/api';") # need to check this API import! It said "no default export" for api, but we didn't use `api` maybe? Or we need `import { api }`.

content = content.replace("<CardHeader>", "<div className=\"mb-4\">")
content = content.replace("</CardHeader>", "</div>")
content = content.replace("<CardTitle", "<h3 className=\"text-lg font-semibold text-[#E5E7EB]\"")
content = content.replace("</CardTitle>", "</h3>")
content = content.replace("<CardContent>", "<div>")
content = content.replace("</CardContent>", "</div>")
content = content.replace("const { user } = useAuth();", "const { isAuthenticated } = useAuth();") # remove unused

with open(file_path, "w") as f:
    f.write(content)

# 3. Fix src/pages/AssessmentArena.tsx
file_path = "frontend/src/pages/AssessmentArena.tsx"
with open(file_path, "r") as f:
    content = f.read()

content = content.replace("import api from '../services/api';", "")
content = content.replace("const { user } = useAuth();", "const { isAuthenticated } = useAuth();")

with open(file_path, "w") as f:
    f.write(content)

print("Done")
