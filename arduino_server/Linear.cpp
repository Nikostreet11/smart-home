#include "Linear.h"

// constructor
Linear::Linear() :
		Control()
{
}

// destructor
Linear::~Linear()
{
}

// getters / setters
Control::Type Linear::getType()
{
	return Type::Linear;
}

const String& Linear::getStringType() const
{
	return "linear";
}

void Linear::updatePort()
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

int Linear::getMin()
{
	return min;
}

void Linear::setMin(int min)
{
	this->min = min;
}

int Linear::getMax()
{
	return max;
}

void Linear::setMax(int max)
{
	this->max = max;
}

int Linear::getValue()
{
	return value;
}

void Linear::setValue(int value)
{
	this->value = value;
	updatePort();
}
