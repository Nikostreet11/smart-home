//#include "SmartItem.h"
#include "Item.h"

// static constructor
SmartItem* SmartItem::create()
{
	return new SmartItem();
}

SmartItem* SmartItem::create(String id, bool active)
{
	SmartItem* smartItem = new SmartItem();
	smartItem->setId(id);
	smartItem->setActive(active);
	return smartItem;
}

SmartItem* SmartItem::copy(SmartItem* origin)
{
	return new SmartItem(origin);
}

/*SmartItem* SmartItem::createFrom(Item* item)
{
	SmartItem* smartItem = new SmartItem();
	smartItem->setId(item->getId());
	return smartItem;
}*/

// destructor
SmartItem::~SmartItem()
{
	for (int i = 0; i < smartControls.size(); i++)
	{
		delete smartControls.get(i);
	}
}

// operations
void SmartItem::addSmartControl(SmartControl* smartControl)
{
	smartControls.add(smartControl);
}

bool SmartItem::removeSmartControl(int index)
{
	if (0 <= index && index < smartControls.size())
	{
		smartControls.remove(index);
		return true;
	}
	else
	{
		return false;
	}
}

// getters / setters
SmartControl* SmartItem::getSmartControl(int index)
{
	return smartControls.get(index);
}

SmartControl* SmartItem::getSmartControl(const String& id)
{
	for (int i = 0; i < smartControls.size(); i++)
	{
		SmartControl* smartControl = smartControls.get(i);
		if (smartControl->getId() == id)
		{
			return smartControl;
		}
	}
	return nullptr;
}

int SmartItem::getSmartControlIndex(const String& id)
{
	for (int i = 0; i < smartControls.size(); i++)
	{
		if (smartControls.get(i)->getId() == id)
		{
			return i;
		}
	}
	return -1;
}

int SmartItem::getSmartControlsSize()
{
	return smartControls.size();
}

String SmartItem::getId() const
{
	return id;
}

void SmartItem::setId(String id)
{
	this->id = id;
}

bool SmartItem::isActive() const
{
	return active;
}

void SmartItem::setActive(bool active)
{
	this->active = active;
}

// constructor
SmartItem::SmartItem() :
		id("unset"),
		active(false)
{
}

// copy constructor
SmartItem::SmartItem(SmartItem* origin) :
		id(origin->getId()),
		active(origin->isActive())
{
	for (int i = 0; i < origin->getSmartControlsSize(); i++)
	{
		SmartControl* smartControl = origin->getSmartControl(i);
		switch (smartControl->getType())
		{
			case Control::Type::Binary:
			{
				SmartBinary* smartBinary = (SmartBinary*) smartControl;
				addSmartControl(SmartBinary::copy(smartBinary));
				break;
			}
			case Control::Type::Linear:
			{
				SmartLinear* smartLinear = (SmartLinear*) smartControl;
				addSmartControl(SmartLinear::copy(smartLinear));
				break;
			}
		}
	}
}
