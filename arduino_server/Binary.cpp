#include "Binary.h"

// constructor
Binary::Binary() :
		Control()
{
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
