#include "Linear.h"
#include "SmartControl.h"
#include "SmartLinear.h"

// static constructors
Linear* Linear::create(PortManager& portManager, bool active)
{
	if (idManager.isIdAvailable())
	{
		return new Linear(portManager, active);
	}
	else
	{
		return nullptr;
	}
}

Linear* Linear::create(PortManager& portManager, bool active, String id)
{
	int trueId = toTrueId(id);
	if (idManager.isIdAvailable(trueId))
	{
		return new Linear(portManager, active, trueId);
	}
	else
	{
		return nullptr;
	}
}

// destructor
Linear::~Linear()
{
}

// operations
Control::Type Linear::getType()
{
	return Type::Linear;
}

String Linear::getStringType() const
{
	return "linear";
}

void Linear::updatePort()
{
	float normalizedValue = (value - min) / (float) (max - min);
	if (active)
	{
		portManager.writeAnalog(port, normalizedValue);
	}
	else
	{
		portManager.writeAnalog(port, false);
	}
}

bool Linear::updateFrom(SmartControl* origin)
{
	if (origin->getType() == Control::Type::Linear)
	{
		SmartLinear* smartLinear = (SmartLinear*) origin;
		setValue(smartLinear->getValue());
		return true;
	}
	else
	{
		return false;
	}
}

void Linear::setDefault()
{
	setValue(min);
}

// getters / setters
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

void Linear::setParameters(int min, int max)
{
	if (min < max)
	{
		this->min = min;
		this->max = max;
		this->value = min;
		updatePort();
	}
	/*else
	{
		this->min = 0;
		this->max = 100;
		this->value = 0;
	}*/
}

int Linear::getValue()
{
	return value;
}

void Linear::setValue(int value)
{
	if (min <= value && value <= max)
	{
		this->value = value;
		updatePort();
	}
}

// constructors
Linear::Linear(PortManager& portManager, bool active) :
		Control(portManager, active)
{
	min = 0;
	max = 100;
	value = 0;
}

Linear::Linear(PortManager& portManager, bool active, int id) :
		Control(portManager, active, id)
{
	min = 0;
	max = 100;
	value = 0;
}
