#include "IdManager.h"

IdManager::IdManager(int maxIds) :
		maxIds(maxIds)
{
	for (int i = 0; i < maxIds; i++)
	{
		int* integer = new int;
		*integer = i;
		freeIds.add(integer);
	}
}

IdManager::~IdManager()
{
	for (int i = 0; i < freeIds.size(); i++)
	{
		delete freeIds.get(i);
	}
}

int IdManager::acquireId()
{
	if (freeIds.size() > 0)
	{
		int id = *(freeIds.get(0));
		delete freeIds.shift();
		return id;
	}
	
	return -1;
}

bool IdManager::freeId(int id)
{
	if (0 <= id && id < maxIds)
	{
		int i = 0;
		
		while (*freeIds.get(i) < id)
		{
			i++;
		}
		
		if (*freeIds.get(i) != id)
		{
			freeIds.add(i, new int(id));
			return true;
		}
	}
	
	return false;
}

bool IdManager::isIdAvailable()
{
	if (freeIds.size() > 0)
	{
		return true;
	}

	return false;
}
