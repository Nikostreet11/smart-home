#include "SmartControl.h"

// destructor
SmartControl::~SmartControl()
{
}

// getters / setters
String SmartControl::getId() const
{
	return id;
}

/*bool SmartControl::isActive() const
{
	return active;
}*/

void SmartControl::setActive(bool active)
{
	this->active = active;
}

// constructor
SmartControl::SmartControl(String id) :
	id(id),
	active(false)
{
}
