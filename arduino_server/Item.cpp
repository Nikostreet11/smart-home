#include "Item.h"

IdManager Item::idManager(Item::MAX_ITEMS);

// static constructors
Item* Item::create(PortManager& portManager)
{
	if (idManager.isIdAvailable())
	{
		return new Item(portManager);
	}
	else
	{
		return nullptr;
	}
}

// destructor
Item::~Item()
{
	idManager.releaseId(id);
}

// getters / setters
int Item::getTrueId() const
{
	return id;
}

String Item::getId() const
{
	String returnId = "item_";
	String stringId = String(id);
	
	for (int count = 0; count < (4 - stringId.length()); count++)
	{
		returnId += '0';
	}

	returnId += stringId;
	
	return returnId;
}

const String& Item::getName() const
{
	return name;
}

void Item::setName(const String& name)
{
	this->name = name;
}

const String& Item::getIcon() const
{
	return icon;
}

void Item::setIcon(const String& icon)
{
	this->icon = icon;
}

const String& Item::getPort() const
{
	return port;
}

void Item::setPort(const String& port)
{
	this->port = port;
}

bool Item::isActive() const
{
	return active;
}

void Item::setActive(bool active)
{
	this->active = active;
	portManager.setActive(port, active);
}

// constructor
Item::Item(PortManager& portManager) :
		portManager(portManager),
		id(idManager.acquireId()),
		name("item"),
		icon("default"),
		port("none"),
		active(false)
{
}
