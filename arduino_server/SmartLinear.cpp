#include "SmartLinear.h"

// static constructors
SmartLinear* SmartLinear::create(String id)
{
	return new SmartLinear(id);
}

SmartLinear* SmartLinear::copy(SmartLinear* origin)
{
	return new SmartLinear(origin);
}

// destructor
SmartLinear::~SmartLinear()
{
}

// getters / setters
Control::Type SmartLinear::getType()
{
	return Control::Type::Linear;
}

String SmartLinear::getStringType() const
{
	return "linear";
}

int SmartLinear::getMin()
{
	return min;
}

int SmartLinear::getMax()
{
	return max;
}

void SmartLinear::setParameters(int min, int max)
{
	if (min < max)
	{
		this->min = min;
		this->max = max;
		this->value = min;
	}
}

int SmartLinear::getValue()
{
	return value;
}

void SmartLinear::setValue(int value)
{
	if (min <= value && value <= max)
	{
		this->value = value;
	}
}

// constructors
SmartLinear::SmartLinear(String id) :
		SmartControl(id)
{
	min = 0;
	max = 100;
	value = 0;
}

SmartLinear::SmartLinear(SmartLinear* origin) :
		SmartControl(origin->getId())
{
	min = origin->getMin();
	max = origin->getMax();
	value = origin->getValue();
}
