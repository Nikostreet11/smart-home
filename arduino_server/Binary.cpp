#include "Binary.h"

// constructors
/*Binary::Binary(PortManager& portManager) :
		Control(portManager)
{
	value = false;
}*/

Binary::Binary(PortManager& portManager, String name/*, String port*/) :
		Control(portManager, name/*, port*/)
{
	value = false;
}

// destructor
Binary::~Binary()
{
}

// getters / setters
Control::Type Binary::getType()
{
	return Type::Binary;
}

const String& Binary::getStringType() const
{
	return "binary";
}

void Binary::updatePort()
{
	if (active)
	{
		// do something
	}
	else
	{
		// do something else
	}
}

int Binary::getValue()
{
	return value;
}

void Binary::setValue(int value)
{
	this->value = value;
	updatePort();
}
