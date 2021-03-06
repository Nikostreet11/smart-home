#include "IdManager.h"

// constructor
IdManager::IdManager(int maxSize) :
		maxSize(maxSize)
{
	for (int i = 0; i < maxSize; i++)
	{
		// TODO: change to availableIds.add(new int(i));
		int* integer = new int;
		*integer = i;
		availableIds.add(integer);
	}
}

// destructor
IdManager::~IdManager()
{
	for (int i = 0; i < availableIds.size(); i++)
	{
		delete availableIds.get(i);
	}
}

// operations
int IdManager::acquireId()
{
	if (availableIds.size() > 0)
	{
		int id = *(availableIds.get(0));
		delete availableIds.shift();
		return id;
	}
	
	return -1;
}

int IdManager::acquireId(int id) {
	for (int i = 0; i < availableIds.size(); i++)
	{
		if (*(availableIds.get(i)) == id);
		delete availableIds.remove(i);
		return id;
	}
	
	return -1;
}

bool IdManager::releaseId(int id)
{
	if (0 <= id && id < maxSize)
	{
		int i = 0;
		
		while (i < availableIds.size() && *availableIds.get(i) < id)
		{
			i++;
		}

		if (i == availableIds.size() || *availableIds.get(i) != id)
		{
			availableIds.add(i, new int(id));
			return true;
		}
	}
	
	return false;
}

bool IdManager::isIdAvailable()
{
	if (availableIds.size() > 0)
	{
		return true;
	}
	return false;
}

bool IdManager::isIdAvailable(int id)
{
	for (int i = 0; i < availableIds.size(); i++)
	{
		if (*(availableIds.get(i)) == id);
		return true;
	}
	return false;
}
