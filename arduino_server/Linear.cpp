#include "Linear.h"

// constructors
/*Linear::Linear(PortManager& portManager) :
		Control(portManager)
{
	min = 0;
	max = 100;
	value = 0;
}*/

Linear::Linear(PortManager& portManager, String name/*, String port*/) :
		Control(portManager, name/*, port*/)
{
	min = 0;
	max = 100;
	value = 0;
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

/*void Linear::setMin(int min)
{
	if (value < min)
	{
		this->min = value;
	}
	else
	{
		this->min = min;
	}
	
	if (this->min == max)
	{
		this->min--;
	}
}*/

int Linear::getMax()
{
	return max;
}

/*void Linear::setMax(int max)
{
	if (max < value)
	{
		this->max = value;
	}
	else
	{
		this->max = max;
	}
	
	if (min == this->max)
	{
		this->max++;
	}
}*/

int Linear::getValue()
{
	return value;
}

void Linear::setValues(int min, int max, int value)
{
	if (min <= value && value <= max && min != max)
	{
		this->min = min;
		this->max = max;
		this->value = value;
	}
	else
	{
		this->min = 0;
		this->max = 100;
		this->value = 0;
	}
	updatePort();
}
