#include "Smartset.h"

//IdManager Smartset::idManager(Smartset::MAX_SMARTSETS);

int Smartset::currentId = 0;

// static constructors
Smartset* Smartset::create(Profile* owner)
{
	if (Smartset::currentId < Smartset::MAX_SMARTSETS)
	//if (idManager.isIdAvailable())
	{
		return new Smartset(owner);
	}
	else
	{
		return nullptr;
	}
}

Smartset* Smartset::copy(Smartset* origin)
{
	return new Smartset(origin);
}

// destructor
Smartset::~Smartset()
{
	for (int i = 0; i < smartItems.size(); i++)
	{
		delete smartItems.get(i);
	}

	/*if (!isCopy)
	{
		idManager.releaseId(id);
	}*/
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

Profile* Smartset::getOwner()
{
	return owner;
}

SmartItem* Smartset::getSmartItem(int index)
{
	return smartItems.get(index);
}

SmartItem* Smartset::getSmartItem(const String& id)
{
	for (int i = 0; i < smartItems.size(); i++)
	{
		SmartItem* smartItem = smartItems.get(i);
		if (id == smartItem->getId())
		{
			return smartItem;
		}
	}
	return nullptr;
}

int Smartset::getSmartItemIndex(const String& id)
{
	for (int i = 0; i < smartItems.size(); i++)
	{
		if (smartItems.get(i)->getId() == id)
		{
			return i;
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
		id(Smartset::currentId),
		//id(idManager.acquireId()),
		name("default"),
		owner(owner),
		isCopy(false)
{
	Smartset::currentId++;
}

// copy constructor
Smartset::Smartset(Smartset* origin) :
		id(origin->getTrueId()),
		name(origin->getName()),
		owner(origin->getOwner()),
		isCopy(true)
{
	for (int i = 0; i < origin->getSmartItemsSize(); i++)
	{
		addSmartItem(SmartItem::copy(origin->getSmartItem(i)));
	}
}
