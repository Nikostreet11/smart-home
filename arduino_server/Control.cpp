#include "Control.h"

// constructor
Control::Control() :
	type(Type::Binary),
	name("TODO"),
	port("none")
{
}

// getters / setters
const String& Control::getName() const
{
	return name;
}

const String& Control::getPort() const
{
	return port;
}

void Control::setPort(const String& port)
{
}

/*bool Control::isActive() const
{
	return active;
}*/

void Control::setActive(bool active)
{
	this->active = active;
	updatePort();
}
