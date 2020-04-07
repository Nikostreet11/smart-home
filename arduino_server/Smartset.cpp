#include "Smartset.h"

int Smartset::currentId = 0;

// static constructors
Smartset* Smartset::create(Profile* owner)
{
	if (Smartset::currentId < Smartset::MAX_SMARTSETS)
	{
		return new Smartset(owner);
	}
	else
	{
		return nullptr;
	}
}

// destructor
Smartset::~Smartset()
{
	for (int index = 0; index < smartItems.size(); index++)
	{
		delete smartItems.get(index);
	}
}

// operations
bool Smartset::addSmartItem(SmartItem* smartItem)
{
	if (smartItems.size() < Smartset::MAX_SMART_ITEMS && smartItem != nullptr)
	{
		smartItems.add(smartItem);
		return true;
	}
	else
	{
		return false;
	}
}

bool Smartset::removeSmartItem(int index)
{
	if (index < smartItems.size())
	{
		delete smartItems.get(index);
		smartItems.remove(index);
		return true;
	}
	else
	{
		return false;
	}
}

// getters / setters
int Smartset::getTrueId() const
{
	return id;
}

String Smartset::getId() const
{
	String returnId = "smartset_";
	String stringId = String(id);
	
	for (int count = 0; count < (4 - stringId.length()); count++)
	{
		returnId += '0';
	}

	returnId += stringId;
	
	return returnId;
}
const String& Smartset::getName() const
{
	return name;
}

void Smartset::setName(const String& name)
{
	this->name = name;
}

SmartItem* Smartset::getSmartItem(int index)
{
	return smartItems.get(index);
}

SmartItem* Smartset::getSmartItem(const String& id)
{
	for (int index = 0; index < smartItems.size(); index++)
	{
		SmartItem* smartItem = smartItems.get(index);
		if (id == smartItem->getId())
		{
			return smartItem;
		}
	}
	return nullptr;
}

int Smartset::getSmartItemIndex(const String& id)
{
	for (int index = 0; index < smartItems.size(); index++)
	{
		if (smartItems.get(index)->getId() == id)
		{
			return index;
		}
	}
	return -1;
}

int Smartset::getSmartItemsSize()
{
	return smartItems.size();
}

// constructors
Smartset::Smartset(Profile* owner) :
		owner(owner),
		id(Smartset::currentId),
		name("default")
{
	Smartset::currentId++;
}
