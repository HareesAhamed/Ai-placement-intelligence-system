import re

def fix_stats_panel():
    file_path = "frontend/src/components/profile/StatsIntegrationPanel.tsx"
    with open(file_path, "r") as f:
        content = f.read()

    # Remove unused imports
    content = content.replace("import React, { useEffect, useState } from 'react';", "import { useEffect, useState } from 'react';")
    content = content.replace("import { RefreshCw, Code, CheckCircle, AlertTriangle } from 'lucide-react';", "import { RefreshCw } from 'lucide-react';")
    
    # Fix double className: <div className="mb-4" className="..."> -> <div className="mb-4 ...">
    content = re.sub(r'<div className="mb-4" className="([^"]+)">', r'<div className="mb-4 \1">', content)

    with open(file_path, "w") as f:
        f.write(content)

def fix_arena():
    file_path = "frontend/src/pages/AssessmentArena.tsx"
    with open(file_path, "r") as f:
        content = f.read()

    content = content.replace("import React, { useEffect, useState, useMemo } from 'react';", "import { useEffect, useState } from 'react';")
    content = content.replace("import { Play, Send, CheckCircle2, Clock } from 'lucide-react';", "import { Play, Send, Clock } from 'lucide-react';")
    content = content.replace("import api, { executeCode } from '../services/api';", "import { executeCode, api } from '../services/api';")
    content = content.replace("const { isAuthenticated } = useAuth();", "")
    content = content.replace("const [input, setInput] = useState('');", "const [input] = useState('');") 

    with open(file_path, "w") as f:
        f.write(content)

def fix_page():
    file_path = "frontend/src/pages/AssessmentPage.tsx"
    with open(file_path, "r") as f:
        content = f.read()
        
    content = content.replace("import api from '../services/api';", "import { api } from '../services/api';")
    content = content.replace("const { isAuthenticated } = useAuth();", "")
    content = content.replace("description=\"Evaluate your current skill level and update your personalized roadmap.\"", "")

    with open(file_path, "w") as f:
        f.write(content)

fix_stats_panel()
fix_arena()
fix_page()
print("Done")
