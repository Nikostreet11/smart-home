#ifndef SMART_LINEAR_H_
#define SMART_LINEAR_H_

#include "SmartControl.h"

class SmartLinear : public SmartControl
{
public:
	// static constructors
	static SmartLinear* create(String id);
	static SmartLinear* copy(SmartLinear* origin);
	
	// destructor
	virtual ~SmartLinear();
	
	// getters / setters
	virtual Control::Type getType();
	virtual String getStringType() const;
	int getMin();
	int getMax();
	void setParameters(int min, int max);
	int getValue();
	void setValue(int value);
	
private:
	// constructors
	SmartLinear(String id);
	SmartLinear(SmartLinear* origin);
	
	// variables
	int min;
	int max;
	int value;
};

#endif /* SMART_LINEAR_H_ */
