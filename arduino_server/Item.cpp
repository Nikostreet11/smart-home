#include "Item.h"

IdManager Item::idManager(Item::MAX_ITEMS);

// static constructor
Item* Item::create()
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
void Item::updateFrom(SmartItem* origin)
{
	for (int i = 0; i < origin->getSmartControlsSize(); i++)
	{
		SmartControl* smartControl = origin->getSmartControl(i);
		Control* control = getControl(smartControl->getId());
		if (control)
		{
			control->updateFrom(smartControl);
		}
	}
	setActive(origin->isActive());
}

void Item::setDefault()
{
	for (int i = 0; i < controls.size(); i++)
	{
		Control* control = controls.get(i);
		control->setDefault();
	}
	setActive(false);
}

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
		//delete controls.get(index);
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

Control* Item::getControl(const String& id)
{
	for (int i = 0; i < controls.size(); i++)
	{
		Control* control = controls.get(i);
		if (control->getId() == id)
		{
			return control;
		}
	}
	return nullptr;
}

int Item::getControlIndex(const String& id)
{
	for (int i = 0; i < controls.size(); i++)
	{
		if (controls.get(i)->getId() == id)
		{
			return i;
		}
	}
	return -1;
}

int Item::getControlsSize()
{
	return controls.size();
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
	for (int i = 0; i < controls.size(); i++)
	{
		controls.get(i)->setActive(active);
	}
}

// constructor
Item::Item() :
		id(idManager.acquireId()),
		name("item"),
		icon("default"),
		active(true)
{
}
