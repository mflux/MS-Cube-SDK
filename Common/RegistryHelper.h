#pragma once
#include <string>

class RegistryHelper
{
public:
	static bool RegistryHelper::GetBoolRegValue(HKEY hKey, const std::string &strValueName, bool &bValue, bool bDefaultValue);
	static LONG RegistryHelper::GetStringRegValue(HKEY hKey, const std::string &strValueName, std::string &strValue, const std::string &strDefaultValue);
	static bool RegistryHelper::CreateRegistryKey(HKEY hKeyRoot, LPCTSTR pszSubKey, HKEY &hNewKey);
};

