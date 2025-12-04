import React, { useState } from 'react';
import { useEditor } from '../../context/EditorContext';
import { Trash2, Plus, Type, Key, Save, Image as ImageIcon, Palette, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HexColorPicker } from 'react-colorful';
import { ICON_KEYS } from '../../utils/constants';

export const AdminDashboard: React.FC = () => {
  const { templates, deleteTemplate, fonts, addFont, removeFont, apiConfig, updateApiConfig, uiConfig, updateUiConfig } = useEditor();
  const [newFontName, setNewFontName] = useState('');
  const [newFontFamily, setNewFontFamily] = useState('');
  
  const [kieKeyInput, setKieKeyInput] = useState(apiConfig.kieAiKey);
  const [imgbbKeyInput, setImgbbKeyInput] = useState(apiConfig.imgbbKey);
  
  const [magicIconInput, setMagicIconInput] = useState(uiConfig.magicEditIcon);
  const [iconColorInput, setIconColorInput] = useState(uiConfig.iconColor);
  const [customIconsInput, setCustomIconsInput] = useState<Record<string, string>>({ ...uiConfig.customIcons });
  
  const [saveStatus, setSaveStatus] = useState('');

  const handleAddFont = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFontName && newFontFamily) {
      addFont({ name: newFontName, family: newFontFamily });
      setNewFontName('');
      setNewFontFamily('');
    }
  };

  const handleIconUrlChange = (key: string, url: string) => {
    setCustomIconsInput(prev => ({
      ...prev,
      [key]: url
    }));
  };

  const handleSaveConfig = () => {
    updateApiConfig({ 
        kieAiKey: kieKeyInput,
        imgbbKey: imgbbKeyInput
    });
    updateUiConfig({
        magicEditIcon: magicIconInput,
        iconColor: iconColorInput,
        customIcons: customIconsInput
    });
    setSaveStatus('Saved!');
    setTimeout(() => setSaveStatus(''), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500">Manage your design templates, fonts, and API keys</p>
          </div>
          <Link to="/" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 flex items-center gap-2">
            <Plus size={18} /> Open Editor
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 mb-8">
            {/* System Configuration */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                    <h2 className="font-semibold text-gray-700 flex items-center gap-2">
                        <Key size={18} /> System Configuration
                    </h2>
                    {saveStatus && <span className="text-sm text-green-600 font-medium animate-fade-in">{saveStatus}</span>}
                </div>
                
                <div className="p-6 grid grid-cols-1 gap-8">
                    {/* API Keys Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">KIE.ai API Key</label>
                            <input 
                                type="password" 
                                value={kieKeyInput}
                                onChange={(e) => setKieKeyInput(e.target.value)}
                                placeholder="Enter KIE.ai Key"
                                className="w-full rounded-md border-gray-300 shadow-sm border p-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Required for AI Generation & Editing.
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ImgBB API Key</label>
                            <input 
                                type="password" 
                                value={imgbbKeyInput}
                                onChange={(e) => setImgbbKeyInput(e.target.value)}
                                placeholder="Enter ImgBB Key"
                                className="w-full rounded-md border-gray-300 shadow-sm border p-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Required to upload images for AI editing. <a href="https://api.imgbb.com/" target="_blank" className="text-indigo-600 underline">Get free key</a>
                            </p>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-6">
                        <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                            <Palette size={16} /> Theme & Icons
                        </h3>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Color Picker */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Global Icon Color</label>
                                <HexColorPicker color={iconColorInput} onChange={setIconColorInput} />
                                <div className="flex items-center gap-2 mt-3">
                                    <div className="w-6 h-6 rounded border" style={{ backgroundColor: iconColorInput }}></div>
                                    <span className="text-sm text-gray-600">{iconColorInput}</span>
                                </div>
                            </div>

                            {/* Icon Overrides List */}
                            <div className="lg:col-span-2 space-y-4 max-h-[400px] overflow-y-auto pr-2">
                                <label className="block text-sm font-medium text-gray-700">Icon Overrides (URL)</label>
                                <p className="text-xs text-gray-500 mb-2">Paste an image URL to replace the default icon.</p>
                                
                                {/* Magic Edit Specific */}
                                <div className="flex gap-2 items-center">
                                    <span className="text-xs font-medium text-gray-600 w-32">Magic Edit</span>
                                    <input 
                                        type="text" 
                                        value={magicIconInput}
                                        onChange={(e) => setMagicIconInput(e.target.value)}
                                        className="flex-1 text-sm border-gray-300 rounded-md shadow-sm border p-1.5"
                                        placeholder="https://..."
                                    />
                                    {magicIconInput && <img src={magicIconInput} className="w-6 h-6 object-contain" />}
                                </div>

                                {/* Dynamic List from Constants */}
                                {Object.entries(ICON_KEYS).map(([keyName, keyValue]) => (
                                    <div key={keyValue} className="flex gap-2 items-center">
                                        <span className="text-xs font-medium text-gray-600 w-32 truncate" title={keyName}>
                                            {keyName.replace('SIDEBAR_', 'Sidebar: ').replace('TOOLBAR_', 'Toolbar: ').toLowerCase()}
                                        </span>
                                        <input 
                                            type="text" 
                                            value={customIconsInput[keyValue] || ''}
                                            onChange={(e) => handleIconUrlChange(keyValue, e.target.value)}
                                            className="flex-1 text-sm border-gray-300 rounded-md shadow-sm border p-1.5"
                                            placeholder="Default"
                                        />
                                        {customIconsInput[keyValue] && (
                                            <img src={customIconsInput[keyValue]} className="w-6 h-6 object-contain" alt="preview" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="px-6 pb-6 bg-gray-50 border-t border-gray-200 pt-4">
                    <button 
                        onClick={handleSaveConfig}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2 ml-auto"
                    >
                        <Save size={16} /> Save All Changes
                    </button>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Templates Section */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <h2 className="font-semibold text-gray-700 flex items-center gap-2">
                        <Type size={18} /> Templates
                    </h2>
                </div>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preview</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {templates.map((template) => (
                        <tr key={template.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <img src={template.thumbnail} alt="" className="h-12 w-20 object-cover rounded border" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{template.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button 
                            onClick={() => deleteTemplate(template.id)}
                            className="text-red-600 hover:text-red-900 flex items-center gap-1 justify-end ml-auto"
                            >
                            <Trash2 size={16} /> Delete
                            </button>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Fonts Section */}
            <div className="bg-white rounded-lg shadow overflow-hidden flex flex-col">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <h2 className="font-semibold text-gray-700 flex items-center gap-2">
                        <Type size={18} /> Font Management
                    </h2>
                </div>
                
                <div className="p-4 border-b border-gray-200 bg-gray-50/50">
                    <form onSubmit={handleAddFont} className="flex gap-2 items-end">
                        <div className="flex-1">
                            <label className="block text-xs font-medium text-gray-500 mb-1">Display Name</label>
                            <input 
                                type="text" 
                                placeholder="e.g. Pacifico"
                                value={newFontName}
                                onChange={e => setNewFontName(e.target.value)}
                                className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2 border"
                                required
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs font-medium text-gray-500 mb-1">Google Font Family</label>
                            <input 
                                type="text" 
                                placeholder="e.g. Pacifico"
                                value={newFontFamily}
                                onChange={e => setNewFontFamily(e.target.value)}
                                className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2 border"
                                required
                            />
                        </div>
                        <button 
                            type="submit"
                            className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                        >
                            Add
                        </button>
                    </form>
                </div>

                <div className="flex-1 overflow-y-auto max-h-[500px]">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 sticky top-0">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Family Param</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {fonts.map((font) => (
                            <tr key={font.name}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900" style={{ fontFamily: font.name }}>{font.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {font.family}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button 
                                onClick={() => removeFont(font.name)}
                                className="text-red-600 hover:text-red-900 flex items-center gap-1 justify-end ml-auto"
                                >
                                <Trash2 size={16} />
                                </button>
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
