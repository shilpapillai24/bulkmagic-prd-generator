import React, { useState } from 'react';
import { FileText, Download, Zap, Coffee, Users, Settings, Copy, FileDown } from 'lucide-react';

const PRDGenerator = () => {
  const [formData, setFormData] = useState({
    featureName: '',
    featureType: '',
    problemStatement: '',
    targetPersona: '',
    businessGoal: ''
  });

  const [generatedPRD, setGeneratedPRD] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const featureTypes = [
    { value: 'marketplace', label: 'Marketplace Core', icon: Coffee },
    { value: 'seller', label: 'Seller Dashboard', icon: Settings },
    { value: 'buyer', label: 'Buyer Experience', icon: Users },
    { value: 'admin', label: 'Admin Platform', icon: Settings },
    { value: 'pwa', label: 'PWA/Mobile', icon: Zap },
    { value: 'loyalty', label: 'Loyalty/Bulk Buying', icon: Users },
    { value: 'auth', label: 'Auth & User Management', icon: Settings }
  ];

  const personas = [
    'Cafe Owners (Small Business)',
    'Bulk Buyers (Cost-conscious)',
    'Regular Customers (Convenience)',
    'Group Buyers (Social)',
    'Platform Admins (Oversight)'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generatePRD = async () => {
    setIsGenerating(true);
    
    const prompt = `Generate a comprehensive Product Requirements Document (PRD) for BulkMagic, a transparent social commerce marketplace for cafes. 

Context:
- Platform: React.js frontend, GraphQL backend, Saleor open source
- Business Model: Online pickup only (no delivery), bulk buying discounts, loyalty programs, group buying with cart splitting
- Current Stage: MVP development in 2-week sprints
- Key Features: Cafe marketplace, seller dashboards, buyer experience, admin analytics, PWA, email notifications, zipcode store discovery, meal bundling

Feature Details:
- Feature Name: ${formData.featureName}
- Feature Type: ${formData.featureType}
- Problem Statement: ${formData.problemStatement}
- Target Persona: ${formData.targetPersona}
- Business Goal: ${formData.businessGoal}

Generate a detailed PRD with these sections:
1. Overview & Problem Statement
2. Goals & Success Metrics
3. User Personas
4. Functional Requirements
5. Non-functional Requirements
6. Data Structure (GraphQL schema)
7. System Design (React components, Saleor integration)
8. Feature Implementation
9. Design Specifications
10. Timeline & Milestones (2-week sprint context)
11. Dependencies
12. Assumptions
13. Out of Scope
14. Risks & Open Questions

Make it comprehensive and actionable for product managers, engineers, designers, and stakeholders. Include specific technical considerations for React/GraphQL/Saleor stack and cafe marketplace context.

Respond with a well-formatted PRD document.`;

    try {
      const response = await window.claude.complete(prompt);
      setGeneratedPRD(response);
    } catch (error) {
      console.error('Error generating PRD:', error);
      setGeneratedPRD('Error generating PRD. Please try again.');
    }
    
    setIsGenerating(false);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedPRD);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const downloadPRD = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedPRD], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${formData.featureName.replace(/\s+/g, '_')}_PRD.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const downloadAsWord = () => {
    const wordContent = `
      <html>
        <head>
          <meta charset="utf-8">
          <title>${formData.featureName} PRD</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
            h1 { color: #333; border-bottom: 2px solid #333; }
            h2 { color: #666; margin-top: 30px; }
            h3 { color: #888; }
            pre { background: #f5f5f5; padding: 15px; border-radius: 5px; }
            .header { text-align: center; margin-bottom: 40px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>BulkMagic Product Requirements Document</h1>
            <h2>${formData.featureName}</h2>
          </div>
          <pre>${generatedPRD}</pre>
        </body>
      </html>
    `;
    
    const blob = new Blob([wordContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const element = document.createElement('a');
    element.href = url;
    element.download = `${formData.featureName.replace(/\s+/g, '_')}_PRD.doc`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center gap-3 mb-8">
          <Coffee className="w-8 h-8 text-orange-600" />
          <h1 className="text-3xl font-bold text-gray-900">BulkMagic PRD Generator</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Feature Name
              </label>
              <input
                type="text"
                value={formData.featureName}
                onChange={(e) => handleInputChange('featureName', e.target.value)}
                placeholder="e.g., Group Buying Cart Splitting"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Feature Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {featureTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.value}
                      onClick={() => handleInputChange('featureType', type.value)}
                      className={`p-3 rounded-md border text-left transition-all ${
                        formData.featureType === type.value
                          ? 'bg-orange-50 border-orange-500 text-orange-700'
                          : 'bg-white border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{type.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Problem Statement
              </label>
              <textarea
                value={formData.problemStatement}
                onChange={(e) => handleInputChange('problemStatement', e.target.value)}
                placeholder="What specific problem does this solve for cafe owners or customers?"
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Persona
              </label>
              <select
                value={formData.targetPersona}
                onChange={(e) => handleInputChange('targetPersona', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">Select primary user</option>
                {personas.map((persona) => (
                  <option key={persona} value={persona}>{persona}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Goal
              </label>
              <textarea
                value={formData.businessGoal}
                onChange={(e) => handleInputChange('businessGoal', e.target.value)}
                placeholder="How does this align with BulkMagic's marketplace strategy?"
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <button
              onClick={generatePRD}
              disabled={!formData.featureName || !formData.featureType || isGenerating}
              className="w-full bg-orange-600 text-white py-3 px-6 rounded-md hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Generating PRD...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  Generate PRD
                </>
              )}
            </button>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Generated PRD</h2>
              {generatedPRD && (
                <div className="flex gap-2">
                  <button
                    onClick={copyToClipboard}
                    className={`px-4 py-2 rounded-md transition-colors flex items-center gap-2 ${
                      copySuccess 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-600 text-white hover:bg-gray-700'
                    }`}
                  >
                    <Copy className="w-4 h-4" />
                    {copySuccess ? 'Copied!' : 'Copy'}
                  </button>
                  
                  <button
                    onClick={downloadAsWord}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <FileDown className="w-4 h-4" />
                    Word
                  </button>
                  
                  <button
                    onClick={downloadPRD}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Text
                  </button>
                </div>
              )}
            </div>
            
            <div className="bg-white rounded-md p-4 min-h-[400px] max-h-[600px] overflow-y-auto border">
              {generatedPRD ? (
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
                    {generatedPRD}
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-20">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Fill out the form and click "Generate PRD" to create your document</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-orange-50 rounded-lg">
          <h3 className="font-semibold text-orange-800 mb-2">BulkMagic Context</h3>
          <p className="text-sm text-orange-700">
            This PRD generator is pre-configured for BulkMagic's cafe marketplace platform using React.js, GraphQL, and Saleor. 
            It includes context for bulk buying, loyalty programs, group buying, seller dashboards, PWA features, and 2-week sprint planning.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PRDGenerator;