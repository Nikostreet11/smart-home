#include "Linear.h"

// static constructors
Linear* Linear::create(PortManager& portManager)
{
	if (idManager.isIdAvailable())
	{
		return new Linear(portManager);
	}
	else
	{
		return nullptr;
	}
}

Linear* Linear::create(PortManager& portManager, String id)
{
	int trueId = toTrueId(id);
	if (idManager.isIdAvailable(trueId))
	{
		return new Linear(portManager, trueId);
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

// getters / setters
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
Linear::Linear(PortManager& portManager) :
		Control(portManager)
{
	min = 0;
	max = 100;
	value = 0;
}

Linear::Linear(PortManager& portManager, int id) :
		Control(portManager, id)
{
	min = 0;
	max = 100;
	value = 0;
}
