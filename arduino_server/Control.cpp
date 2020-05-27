#include "Control.h"

// constructors
/*Control::Control(PortManager& portManager) :
	portManager(portManager),
	name("default"),
	port("none"),
	active(false)
{
}*/

Control::Control(PortManager& portManager, String name/*, String port*/) :
	portManager(portManager),
	name(name),
	port("none"),
	active(false)
{
	//setPort(port);
}

Control::~Control()
{
	portManager.unlock(port);
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
	if (portManager.isAvailable(port))
	{
		portManager.unlock(this->port);
		portManager.lock(port);
		this->port = port;
	}
	updatePort();
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
