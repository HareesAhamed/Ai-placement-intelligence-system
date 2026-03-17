with open("frontend/src/pages/Dashboard.tsx", "r") as f:
    content = f.read()

replacement = """
      </div>
      
      {aiAnalysisRes && (
        <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           className="mt-8 grid gap-6 lg:grid-cols-2"
        >
          <Card hover={false} className="border-[#6366F1]/20">
            <h3 className="text-sm font-semibold text-[#E5E7EB] mb-4 flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-[#6366F1]" />
              Smart Recommendations
            </h3>
            <div className="space-y-4">
              {aiAnalysisRes?.recommendations?.length > 0 ? (
                aiAnalysisRes.recommendations.map((rec: any, idx: number) => (
                  <div key={idx} className="p-4 rounded-xl border border-[#1F2937]/40 bg-[#0B1120]/60">
                    <h4 className="text-sm font-medium text-[#E5E7EB]">{rec.title}</h4>
                    <p className="text-xs text-[#9CA3AF] mt-1 mb-3">{rec.reason}</p>
                    <button 
                      onClick={() => navigate(`/workspace/${rec.problem_id}`)}
                      className="text-xs font-semibold text-white bg-[#6366F1] hover:bg-[#4F46E5] px-3 py-1.5 rounded-lg transition-colors"
                    >
                      {rec.action_item}
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[#9CA3AF]">You are perfectly on track! No urgent recommendations right now.</p>
              )}
            </div>
          </Card>
          
          <Card hover={false} className="border-[#10B981]/20">
            <h3 className="text-sm font-semibold text-[#E5E7EB] mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#10B981]" />
              Learning Pattern Detection
            </h3>
            <div className="space-y-3">
              {aiAnalysisRes?.learning_patterns?.length > 0 ? (
                aiAnalysisRes.learning_patterns.map((pattern: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl border border-[#1F2937]/40 bg-[#0B1120]/60">
                     <Lightbulb className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
                     <p className="text-xs text-[#E5E7EB] leading-relaxed">{pattern}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[#9CA3AF]">Your learning patterns look stable across the board.</p>
              )}
            </div>
          </Card>
        </motion.div>
      )}
    </motion.div>
"""

content = content.replace("      </div>\n    </motion.div>", replacement)

with open("frontend/src/pages/Dashboard.tsx", "w") as f:
    f.write(content)
