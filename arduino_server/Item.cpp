#include "Item.h"

int Item::currentId = 0;

// static constructors
Item* Item::create(PortManager& portManager)
{
	if (Item::currentId < Item::MAX_ITEMS)
	{
		return new Item(portManager);
	}
	else
	{
		return nullptr;
	}
}

/*Item* Item::create(String name, String icon, PortManager& portManager)
{
	Item* item = create(portManager);
	
	if (item)
	{
		item->setName(name);
		item->setIcon(icon);
	}
	
	return item;
}*/

// destructor
Item::~Item() {}

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
	if (active)
	{
		portManager.turnOn(port);
	}
	else
	{
		portManager.turnOff(port);
	}
}

void Item::turnOn()
{
	active = true;
	portManager.turnOn(port);
}

void Item::turnOff()
{
	active = false;
	portManager.turnOff(port);
}

// constructor
Item::Item(PortManager& portManager) :
		portManager(portManager),
		id(Item::currentId),
		name("item"),
		icon("default"),
		port("none"),
		active(false)
{
	Item::currentId++;
}
