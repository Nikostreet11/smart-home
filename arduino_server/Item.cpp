#include "Item.h"

IdManager Item::idManager(Item::MAX_ITEMS);

// static constructors
Item* Item::create(/*PortManager& portManager*/)
{
	if (idManager.isIdAvailable())
	{
		return new Item(/*portManager*/);
	}
	else
	{
		return nullptr;
	}
}

// destructor
Item::~Item()
{
	for (int i = 0; i < controls.size(); i++)
	{
		delete controls.get(i);
	}
	
	idManager.releaseId(id);
}

// operations
bool Item::isControlNameAvailable(const String& name)
{
	bool taken = false;
	for (int i = 0; i < controls.size(); i++)
	{
		if (controls.get(i)->getName() == name)
		{
			return false;
		}
	}
	return true;
}

bool Item::addControl(Control* control)
{
	if (controls.size() < Item::MAX_CONTROLS && control != nullptr)
	{
		controls.add(control);
		return true;
	}
	else
	{
		return false;
	}
}

bool Item::removeControl(int index)
{
	if (0 <= index && index < controls.size())
	{
		delete controls.get(index);
		controls.remove(index);
		return true;
	}
	else
	{
		return false;
	}
}

// getters / setters
Control* Item::getControl(int index)
{
	return controls.get(index);
}

Control* Item::getControl(const String& name)
{
	for (int i = 0; i < controls.size(); i++)
	{
		Control* currentControl = controls.get(i);
		if (currentControl->getName() == name)
		{
			return currentControl;
		}
	}
	return nullptr;
}

int Item::getControlsIndex(const String& name)
{
	for (int i = 0; i < controls.size(); i++)
	{
		if (controls.get(i)->getName() == name)
		{
			return i;
		}
	}
	return -1;
}
	
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

/*const String& Item::getPort() const
{
	return port;
}*/

/*void Item::setPort(const String& port)
{
	this->port = port;
}*/

bool Item::isActive() const
{
	return active;
}

void Item::setActive(bool active)
{
	this->active = active;
	//portManager.setActive(port, active);
	// TODO: set controls active
}

// constructor
Item::Item(/*PortManager& portManager*/) :
		//portManager(portManager),
		id(idManager.acquireId()),
		name("item"),
		icon("default"),
		//port("none"),
		active(false)
{
}
