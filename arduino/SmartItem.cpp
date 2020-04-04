#include "SmartItem.h"
#include "Item.h"

// static constructor
SmartItem* SmartItem::create(String id, bool active)
{
	SmartItem* smartItem = new SmartItem();
	smartItem->setId(id);
	smartItem->setActive(active);
	return smartItem;
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
}

// getters / setters
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
