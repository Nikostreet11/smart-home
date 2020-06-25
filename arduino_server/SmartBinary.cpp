#include "SmartBinary.h"

// static constructors
SmartBinary* SmartBinary::create(String id)
{
	return new SmartBinary(id);
}

SmartBinary* SmartBinary::copy(SmartBinary* origin)
{
	return new SmartBinary(origin);
}

// destructor
SmartBinary::~SmartBinary()
{
}

// operations
Control::Type SmartBinary::getType()
{
	return Control::Type::Binary;
}

String SmartBinary::getStringType() const
{
	return "binary";
}

// getters / setters
bool SmartBinary::getValue()
{
	return value;
}

void SmartBinary::setValue(bool value)
{
	this->value = value;
}

// constructors
SmartBinary::SmartBinary(String id) :
		SmartControl(id)
{
	value = false;
}

SmartBinary::SmartBinary(SmartBinary* origin) :
		SmartControl(origin->getId())
{
	value = origin->getValue();
}
