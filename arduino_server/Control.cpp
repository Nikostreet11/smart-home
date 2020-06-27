#include "Control.h"

IdManager Control::idManager(Control::MAX_CONTROLS);

// destructor
Control::~Control()
{
	idManager.releaseId(id);
	portManager.unlock(port);
}

// getters / setters
int Control::getTrueId() const
{
	return id;
}

String Control::getId() const
{
	String returnId = "control_";
	String stringId = String(id);
	for (int count = 0; count < (4 - stringId.length()); count++)
	{
		returnId += '0';
	}
	returnId += stringId;
	return returnId;
}

const String& Control::getName() const
{
	return name;
}

void Control::setName(const String& name)
{
	this->name = name;
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

// internal
int Control::toTrueId(String id)
{
	String trueId = id.substring(String("control_").length());
	
	while (trueId.charAt(0) == '0')
	{
		trueId.remove(0, 1);
	};
	
	return trueId.toInt();
}

// constructors
Control::Control(PortManager& portManager, bool active) :
	portManager(portManager),
	id(idManager.acquireId()),
	name("default"),
	port("none"),
	active(active)
{
}

Control::Control(PortManager& portManager, bool active, int id) :
	portManager(portManager),
	id(idManager.acquireId(id)),
	name("default"),
	port("none"),
	active(active)
{
}
