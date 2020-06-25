#include "Binary.h"
#include "SmartControl.h"
#include "SmartBinary.h"

// static constructors
Binary* Binary::create(PortManager& portManager)
{
	if (idManager.isIdAvailable())
	{
		return new Binary(portManager);
	}
	else
	{
		return nullptr;
	}
}

Binary* Binary::create(PortManager& portManager, String id)
{
	int trueId = toTrueId(id);
	if (idManager.isIdAvailable(trueId))
	{
		return new Binary(portManager, trueId);
	}
	else
	{
		return nullptr;
	}
}

// destructor
Binary::~Binary()
{
}

// operations
Control::Type Binary::getType()
{
	return Type::Binary;
}

String Binary::getStringType() const
{
	return "binary";
}

void Binary::updatePort()
{
	if (active)
	{
		portManager.writeDigital(port, value);
	}
	else
	{
		portManager.writeDigital(port, false);
	}
}

bool Binary::updateFrom(SmartControl* origin)
{
	if (origin->getType() == Control::Type::Binary)
	{
		SmartBinary* smartBinary = (SmartBinary*) origin;
		setValue(smartBinary->getValue());
		return true;
	}
	else
	{
		return false;
	}
}

void Binary::setDefault()
{
	setValue(false);
}

// getters / setters
bool Binary::getValue()
{
	return value;
}

void Binary::setValue(bool value)
{
	this->value = value;
	updatePort();
}

// constructors
Binary::Binary(PortManager& portManager) :
		Control(portManager)
{
	value = false;
}

Binary::Binary(PortManager& portManager, int id) :
		Control(portManager, id)
{
	value = false;
}
