#include "Smartset.h"

int Smartset::currentId = 0;

// static constructors
Smartset* Smartset::create()
{
	if (Smartset::currentId < Smartset::MAX_SMARTSETS)
	{
		return new Smartset();
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

int Smartset::getSize()
{
	return smartItems.size();
}

SmartItem* Smartset::get(int index)
{
	return smartItems.get(index);
}

SmartItem* Smartset::get(const String& id)
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

bool Smartset::add(SmartItem* smartItem)
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

bool Smartset::remove(int index)
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

// constructors
Smartset::Smartset() :
		id(Smartset::currentId),
		name("default")
{
	Smartset::currentId++;
}
